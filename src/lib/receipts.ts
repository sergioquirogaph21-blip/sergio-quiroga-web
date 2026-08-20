import "server-only";

/**
 * Validación de comprobantes de pago. El archivo en sí se guarda como
 * bytes directamente en la base de datos (columna `receiptData` de
 * Gallery) — no en el filesystem del servidor — para que funcione en
 * hosting serverless (Vercel, etc.) donde el disco no persiste entre
 * requests.
 */
export const ALLOWED_RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export const MAX_RECEIPT_SIZE = 8 * 1024 * 1024; // 8MB
