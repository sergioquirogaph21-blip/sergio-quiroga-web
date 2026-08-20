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
    "receiptFileName" TEXT,
    "receiptOriginalName" TEXT,
    "receiptMimeType" TEXT,
    "receiptUploadedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Gallery" ("clientName", "coverImage", "createdAt", "driveFolderId", "eventDate", "eventType", "id", "isActive", "passwordHash", "slug", "title", "updatedAt") SELECT "clientName", "coverImage", "createdAt", "driveFolderId", "eventDate", "eventType", "id", "isActive", "passwordHash", "slug", "title", "updatedAt" FROM "Gallery";
DROP TABLE "Gallery";
ALTER TABLE "new_Gallery" RENAME TO "Gallery";
CREATE UNIQUE INDEX "Gallery_slug_key" ON "Gallery"("slug");
CREATE INDEX "Gallery_slug_idx" ON "Gallery"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
