/**
 * Copia todos los datos de tu base local (SQLite, dev.db) a la base de
 * producción (Postgres) la primera vez que publicás el sitio — fotos del
 * portafolio, servicios/precios, galerías de clientes y mensajes.
 *
 * Uso (una sola vez, después de correr `prisma migrate deploy` contra la
 * base de producción):
 *
 *   PROD_DATABASE_URL="postgresql://...tu conexión de Supabase..." npx tsx prisma/migrate-to-production.ts
 *
 * No borra nada de la base local. Es seguro correrlo de nuevo: si ya hay
 * datos en producción, no duplica (se salta lo que ya existe).
 */
import { PrismaClient } from "@prisma/client";

const prodUrl = process.env.PROD_DATABASE_URL;
if (!prodUrl) {
  console.error("Definí PROD_DATABASE_URL con la connection string de producción.");
  process.exit(1);
}

const local = new PrismaClient(); // usa DATABASE_URL de .env (sqlite local)
const prod = new PrismaClient({ datasourceUrl: prodUrl });

async function migratePortfolio() {
  const already = await prod.portfolioImage.count();
  if (already > 0) {
    console.log(`Producción ya tiene ${already} fotos de portafolio, se omite.`);
    return;
  }
  const images = await local.portfolioImage.findMany();
  for (const img of images) {
    await prod.portfolioImage.create({ data: img });
  }
  console.log(`Portafolio: ${images.length} fotos copiadas.`);
}

async function migrateServices() {
  const already = await prod.serviceGroup.count();
  if (already > 0) {
    console.log(`Producción ya tiene ${already} grupos de servicios, se omite.`);
    return;
  }
  const groups = await local.serviceGroup.findMany({ include: { tiers: true } });
  for (const group of groups) {
    const { tiers, ...groupData } = group;
    await prod.serviceGroup.create({
      data: { ...groupData, tiers: { create: tiers.map(({ id: _id, groupId: _groupId, ...t }) => t) } },
    });
  }
  console.log(`Servicios: ${groups.length} grupos copiados.`);
}

async function migrateGalleries() {
  const already = await prod.gallery.count();
  if (already > 0) {
    console.log(`Producción ya tiene ${already} galerías, se omite.`);
    return;
  }
  const galleries = await local.gallery.findMany({ include: { favorites: true } });
  for (const gallery of galleries) {
    const { favorites, ...galleryData } = gallery;
    await prod.gallery.create({
      data: {
        ...galleryData,
        favorites: { create: favorites.map(({ id: _id, galleryId: _galleryId, ...f }) => f) },
      },
    });
  }
  console.log(`Galerías: ${galleries.length} copiadas.`);
}

async function migrateMessages() {
  const already = await prod.contactMessage.count();
  if (already > 0) {
    console.log(`Producción ya tiene ${already} mensajes, se omite.`);
    return;
  }
  const messages = await local.contactMessage.findMany();
  for (const m of messages) {
    await prod.contactMessage.create({ data: m });
  }
  console.log(`Mensajes: ${messages.length} copiados.`);
}

async function main() {
  await migratePortfolio();
  await migrateServices();
  await migrateGalleries();
  await migrateMessages();
  console.log("Listo.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await local.$disconnect();
    await prod.$disconnect();
  });
