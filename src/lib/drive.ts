import { google } from "googleapis";
import type { drive_v3 } from "googleapis";

/**
 * Cliente de Google Drive API v3 autenticado con una Service Account.
 * Ver GOOGLE_DRIVE_SETUP.md para la guía de configuración.
 */

let driveClient: drive_v3.Drive | null = null;
let authClient: InstanceType<typeof google.auth.JWT> | null = null;

function getAuth() {
  if (authClient) return authClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error(
      "Faltan credenciales de Google Drive. Configura GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY en tu archivo .env (ver GOOGLE_DRIVE_SETUP.md)."
    );
  }

  authClient = new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return authClient;
}

export function getDrive(): drive_v3.Drive {
  if (driveClient) return driveClient;
  driveClient = google.drive({ version: "v3", auth: getAuth() });
  return driveClient;
}

const FOLDER_MIME = "application/vnd.google-apps.folder";

export type DrivePhoto = {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink: string | null;
  createdTime: string | null;
  size: string | null;
  width: number | null;
  height: number | null;
};

/**
 * Un nodo del árbol de carpetas de una galería. Las galerías simples (sin
 * subcarpetas) son sólo un nodo raíz con `photos` y `folders: []` — el mismo
 * comportamiento de siempre. Galerías organizadas por secciones (ej. equipo
 * / categoría en una cobertura deportiva) anidan tantos niveles como haga
 * falta.
 */
export type DriveFolderNode = {
  id: string;
  name: string;
  photos: DrivePhoto[];
  folders: DriveFolderNode[];
};

const MAX_TREE_DEPTH = 6;

async function listFolderChildren(folderId: string) {
  const drive = getDrive();
  const photos: DrivePhoto[] = [];
  const subfolders: { id: string; name: string }[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields:
        "nextPageToken, files(id, name, mimeType, thumbnailLink, createdTime, size, imageMediaMetadata)",
      orderBy: "folder,name_natural",
      pageSize: 1000,
      pageToken,
    });

    for (const f of res.data.files ?? []) {
      if (!f.id || !f.name) continue;
      if (f.mimeType === FOLDER_MIME) {
        subfolders.push({ id: f.id, name: f.name });
      } else if (f.mimeType?.startsWith("image/")) {
        photos.push({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          thumbnailLink: f.thumbnailLink ?? null,
          createdTime: f.createdTime ?? null,
          size: f.size ?? null,
          width: f.imageMediaMetadata?.width ?? null,
          height: f.imageMediaMetadata?.height ?? null,
        });
      }
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return { photos, subfolders };
}

async function buildTree(folderId: string, name: string, depth: number): Promise<DriveFolderNode> {
  const { photos, subfolders } = await listFolderChildren(folderId);

  const folders =
    depth < MAX_TREE_DEPTH
      ? await Promise.all(subfolders.map((sf) => buildTree(sf.id, sf.name, depth + 1)))
      : [];

  return { id: folderId, name, photos, folders };
}

const treeCache = new Map<string, { tree: DriveFolderNode; expires: number }>();
const TREE_CACHE_TTL_MS = 60_000;

/**
 * Devuelve el árbol completo de una galería (carpeta raíz + subcarpetas
 * anidadas, recursivamente) con sus fotos. Se cachea en memoria por un
 * minuto para que navegar entre secciones o ver fotos en el visor no
 * dispare decenas de llamadas a la API de Drive en cada clic.
 */
export async function getGalleryTree(rootFolderId: string): Promise<DriveFolderNode> {
  const cached = treeCache.get(rootFolderId);
  if (cached && cached.expires > Date.now()) return cached.tree;

  const tree = await buildTree(rootFolderId, "", 0);
  treeCache.set(rootFolderId, { tree, expires: Date.now() + TREE_CACHE_TTL_MS });
  return tree;
}

export type FlatPhoto = { photo: DrivePhoto; path: string[] };

/** Aplana el árbol a una lista de fotos, cada una con su ruta de carpetas (para armar el .zip organizado). */
export function flattenTree(node: DriveFolderNode, path: string[] = []): FlatPhoto[] {
  const own = node.photos.map((photo) => ({ photo, path }));
  const nested = node.folders.flatMap((f) => flattenTree(f, [...path, f.name]));
  return [...own, ...nested];
}

export function findPhotoInTree(node: DriveFolderNode, fileId: string): boolean {
  if (node.photos.some((p) => p.id === fileId)) return true;
  return node.folders.some((f) => findPhotoInTree(f, fileId));
}

/** Busca una subcarpeta por id en cualquier nivel del árbol (incluida la raíz). */
export function findFolderInTree(node: DriveFolderNode, folderId: string): DriveFolderNode | null {
  if (node.id === folderId) return node;
  for (const f of node.folders) {
    const found = findFolderInTree(f, folderId);
    if (found) return found;
  }
  return null;
}

export async function getFileMeta(fileId: string) {
  const drive = getDrive();
  const res = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, size",
  });
  return res.data;
}

/**
 * Confirma que un archivo pertenece al árbol de Drive de la galería (en
 * cualquier nivel de subcarpetas), para evitar que una sesión de una
 * galería acceda a archivos de otra usando el mismo fileId adivinado.
 *
 * No usamos `files.get({ fields: 'parents' })` porque Drive no expone ese
 * campo para archivos de carpetas compartidas que no forman parte de "Mi
 * unidad" de la Service Account (típico cuando el fotógrafo comparte una
 * carpeta de su Drive personal, en vez de una Unidad compartida). En cambio
 * recorremos el árbol de la galería (cacheado) y verificamos que el fileId
 * aparezca ahí.
 */
export async function fileBelongsToFolder(fileId: string, rootFolderId: string) {
  const tree = await getGalleryTree(rootFolderId);
  return findPhotoInTree(tree, fileId);
}

/** Descarga el contenido binario completo de un archivo (imagen original o para armar el .zip). */
export async function getFileStream(fileId: string) {
  const drive = getDrive();
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );
  return res.data; // NodeJS.ReadableStream
}

/**
 * Descarga una miniatura desde el thumbnailLink de Drive, autenticada con el
 * access token de la service account. Permite pedir un tamaño específico
 * reemplazando el parámetro `sz` que Drive agrega por defecto (=s220).
 */
export async function fetchThumbnail(thumbnailLink: string, size = 640) {
  const auth = getAuth();
  const token = await auth.getAccessToken();

  const url = thumbnailLink.replace(/=s\d+$/, `=s${size}`);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token.token}` },
  });

  if (!res.ok) {
    throw new Error(`No se pudo obtener la miniatura (${res.status})`);
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType };
}
