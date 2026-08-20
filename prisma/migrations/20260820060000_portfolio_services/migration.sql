-- CreateTable
CREATE TABLE "PortfolioImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "data" BLOB NOT NULL,
    "mimeType" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ServiceGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ServiceTier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ServiceTier_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ServiceGroup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gallery" (
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
    "requiresPayment" BOOLEAN NOT NULL DEFAULT false,
    "downloadsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "receiptData" BLOB,
    "receiptOriginalName" TEXT,
    "receiptMimeType" TEXT,
    "receiptUploadedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Gallery" ("clientName", "coverImage", "createdAt", "downloadsEnabled", "driveFolderId", "eventDate", "eventType", "id", "isActive", "passwordHash", "receiptMimeType", "receiptOriginalName", "receiptUploadedAt", "requiresPayment", "slug", "title", "updatedAt") SELECT "clientName", "coverImage", "createdAt", "downloadsEnabled", "driveFolderId", "eventDate", "eventType", "id", "isActive", "passwordHash", "receiptMimeType", "receiptOriginalName", "receiptUploadedAt", "requiresPayment", "slug", "title", "updatedAt" FROM "Gallery";
DROP TABLE "Gallery";
ALTER TABLE "new_Gallery" RENAME TO "Gallery";
CREATE UNIQUE INDEX "Gallery_slug_key" ON "Gallery"("slug");
CREATE INDEX "Gallery_slug_idx" ON "Gallery"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PortfolioImage_category_idx" ON "PortfolioImage"("category");

