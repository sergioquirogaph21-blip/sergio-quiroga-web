import type { GalleryFolderNode, GalleryPhoto } from "@/types/gallery";

/** Sigue una lista de ids de subcarpeta desde la raíz y devuelve el nodo actual. */
export function resolveNode(
  root: GalleryFolderNode,
  pathIds: string[]
): GalleryFolderNode | null {
  let node = root;
  for (const id of pathIds) {
    const next = node.folders.find((f) => f.id === id);
    if (!next) return null;
    node = next;
  }
  return node;
}

/** Devuelve la raíz + cada carpeta atravesada, para armar el breadcrumb. */
export function resolvePathNodes(
  root: GalleryFolderNode,
  pathIds: string[]
): GalleryFolderNode[] {
  const nodes = [root];
  let node = root;
  for (const id of pathIds) {
    const next = node.folders.find((f) => f.id === id);
    if (!next) break;
    nodes.push(next);
    node = next;
  }
  return nodes;
}

/** Actualiza (de forma inmutable) una foto en cualquier nivel del árbol. */
export function updateTreePhoto(
  node: GalleryFolderNode,
  fileId: string,
  updates: Partial<GalleryPhoto>
): GalleryFolderNode {
  return {
    ...node,
    photos: node.photos.map((p) => (p.id === fileId ? { ...p, ...updates } : p)),
    folders: node.folders.map((f) => updateTreePhoto(f, fileId, updates)),
  };
}

export function countPhotosRecursive(node: GalleryFolderNode): number {
  return node.photos.length + node.folders.reduce((sum, f) => sum + countPhotosRecursive(f), 0);
}

export function countFavoritesRecursive(node: GalleryFolderNode): number {
  return (
    node.photos.filter((p) => p.favorite).length +
    node.folders.reduce((sum, f) => sum + countFavoritesRecursive(f), 0)
  );
}
