-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientName" TEXT,
    "eventType" TEXT,
    "eventDate" DATETIME,
    "driveFolderId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "coverImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "galleryId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "thumbnailLink" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" DATETIME,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_slug_key" ON "Gallery"("slug");

-- CreateIndex
CREATE INDEX "Gallery_slug_idx" ON "Gallery"("slug");

-- CreateIndex
CREATE INDEX "Favorite_galleryId_idx" ON "Favorite"("galleryId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_galleryId_fileId_key" ON "Favorite"("galleryId", "fileId");
