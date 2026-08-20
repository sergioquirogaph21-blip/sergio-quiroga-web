/**
 * Siembra única: carga las fotos de /public/portfolio y los paquetes de
 * servicios que ya estaban hardcodeados en el código, a la base de datos,
 * para que a partir de ahora sean editables desde /admin/portfolio y
 * /admin/servicios.
 *
 * Correr con: npx tsx prisma/seed.ts
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PORTFOLIO_IMAGES } from "../src/lib/portfolio-data";
import { SERVICE_GROUPS } from "../src/lib/services-data";

const prisma = new PrismaClient();

function mimeFor(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function seedPortfolio() {
  const existing = await prisma.portfolioImage.count();
  if (existing > 0) {
    console.log(`PortfolioImage ya tiene ${existing} filas, se omite.`);
    return;
  }

  let order = 0;
  for (const img of PORTFOLIO_IMAGES) {
    const filePath = path.join(process.cwd(), "public", img.src);
    try {
      const data = await readFile(filePath);
      await prisma.portfolioImage.create({
        data: {
          category: img.category,
          data,
          mimeType: mimeFor(img.src),
          alt: img.alt,
          width: img.width,
          height: img.height,
          order: order++,
        },
      });
      console.log(`OK  ${img.src}`);
    } catch (err) {
      console.error(`FALLÓ ${img.src}:`, (err as Error).message);
    }
  }
}

async function seedServices() {
  const existing = await prisma.serviceGroup.count();
  if (existing > 0) {
    console.log(`ServiceGroup ya tiene ${existing} filas, se omite.`);
    return;
  }

  let groupOrder = 0;
  for (const group of SERVICE_GROUPS) {
    const created = await prisma.serviceGroup.create({
      data: {
        category: group.category,
        description: group.description,
        order: groupOrder++,
      },
    });

    let tierOrder = 0;
    for (const tier of group.tiers) {
      await prisma.serviceTier.create({
        data: {
          groupId: created.id,
          name: tier.name,
          price: tier.price,
          description: tier.description,
          features: tier.features.join("\n"),
          featured: tier.featured ?? false,
          order: tierOrder++,
        },
      });
    }
    console.log(`OK  grupo "${group.category}" (${group.tiers.length} combos)`);
  }
}

async function main() {
  await seedPortfolio();
  await seedServices();
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
