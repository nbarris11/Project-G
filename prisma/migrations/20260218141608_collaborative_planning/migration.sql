/*
  Warnings:

  - Added the required column `responseDeadline` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "MemberResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "budgetPerPerson" REAL NOT NULL,
    "availableWeekends" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MemberResponse_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "numberOfGolfers" INTEGER NOT NULL,
    "skillLevel" TEXT NOT NULL,
    "lodgingType" TEXT NOT NULL,
    "notes" TEXT,
    "joinCode" TEXT NOT NULL,
    "joinPassword" TEXT NOT NULL,
    "responseDeadline" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "budgetPerPerson" REAL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Trip_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("budgetPerPerson", "createdAt", "destination", "endDate", "id", "joinCode", "joinPassword", "lodgingType", "name", "notes", "numberOfGolfers", "ownerId", "skillLevel", "startDate", "updatedAt") SELECT "budgetPerPerson", "createdAt", "destination", "endDate", "id", "joinCode", "joinPassword", "lodgingType", "name", "notes", "numberOfGolfers", "ownerId", "skillLevel", "startDate", "updatedAt" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
CREATE UNIQUE INDEX "Trip_joinCode_key" ON "Trip"("joinCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
