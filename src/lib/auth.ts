import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-cambiar-en-produccion"
);

export const ADMIN_COOKIE = "sqf_admin_session";
export const galleryCookieName = (galleryId: string) => `sqf_gallery_${galleryId}`;

async function sign(payload: Record<string, unknown>, expiresIn: string) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

async function verify<T>(token: string | undefined): Promise<T | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as T;
  } catch {
    return null;
  }
}

// --- Sesión de administrador ---

export async function createAdminSessionToken() {
  return sign({ role: "admin" }, "7d");
}

export async function verifyAdminSessionToken(token: string | undefined) {
  const payload = await verify<{ role: string }>(token);
  return payload?.role === "admin";
}

// --- Sesión de galería de cliente ---

export async function createGallerySessionToken(galleryId: string) {
  return sign({ galleryId }, "30d");
}

export async function verifyGallerySessionToken(
  token: string | undefined,
  galleryId: string
) {
  const payload = await verify<{ galleryId: string }>(token);
  return payload?.galleryId === galleryId;
}

// --- Contraseñas ---

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
