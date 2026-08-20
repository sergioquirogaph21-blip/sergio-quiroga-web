import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isGalleryAuthenticated } from "@/lib/auth-guard";
import { PasswordGate } from "@/components/gallery/PasswordGate";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export default async function GaleriaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const gallery = await prisma.gallery.findUnique({
    where: { slug },
    select: { id: true, title: true, clientName: true, isActive: true },
  });

  if (!gallery || !gallery.isActive) {
    notFound();
  }

  const authenticated = await isGalleryAuthenticated(gallery.id);

  if (!authenticated) {
    return <PasswordGate slug={slug} title={gallery.title} clientName={gallery.clientName} />;
  }

  return <GalleryClient slug={slug} />;
}
