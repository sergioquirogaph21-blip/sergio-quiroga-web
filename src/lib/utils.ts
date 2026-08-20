import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

/**
 * Acepta el ID de carpeta de Drive tal cual, o el link completo que copia
 * Google ("https://drive.google.com/drive/folders/ID?usp=drive_link") y en
 * ambos casos devuelve sólo el ID limpio, sin query string ni barras.
 */
export function parseDriveFolderId(input: string): string {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (fromUrl) return fromUrl[1];
  return trimmed.split(/[?#/]/)[0];
}

export function formatBytes(bytes: number | string | null | undefined) {
  const n = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (!n || Number.isNaN(n)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = n;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(1)} ${units[i]}`;
}
