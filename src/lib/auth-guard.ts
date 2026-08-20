import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE,
  galleryCookieName,
  verifyAdminSessionToken,
  verifyGallerySessionToken,
} from "@/lib/auth";

/** Redirige a /admin/login si no hay una sesión de administrador válida. */
export async function requireAdmin() {
  const store = await cookies();
  const ok = await verifyAdminSessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}

/** Para usar en route handlers: true/false, sin redirigir. */
export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifyAdminSessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** Verifica si el cliente tiene sesión activa para una galería específica. */
export async function isGalleryAuthenticated(galleryId: string) {
  const store = await cookies();
  return verifyGallerySessionToken(store.get(galleryCookieName(galleryId))?.value, galleryId);
}

/** Acceso a recursos de una galería: válido para el cliente de esa galería o para el admin. */
export async function canAccessGallery(galleryId: string) {
  const [gallery, admin] = await Promise.all([
    isGalleryAuthenticated(galleryId),
    isAdminAuthenticated(),
  ]);
  return gallery || admin;
}
