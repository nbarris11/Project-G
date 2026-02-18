/*
  Warnings:

  - Added the required column `homeLocation` to the `MemberResponse` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MemberResponse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "homeLocation" TEXT NOT NULL,
    "budgetPerPerson" REAL NOT NULL,
    "availableWeekends" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MemberResponse_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MemberResponse" ("availableWeekends", "budgetPerPerson", "createdAt", "id", "memberName", "tripId") SELECT "availableWeekends", "budgetPerPerson", "createdAt", "id", "memberName", "tripId" FROM "MemberResponse";
DROP TABLE "MemberResponse";
ALTER TABLE "new_MemberResponse" RENAME TO "MemberResponse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
