/*
  Warnings:

  - You are about to drop the `_PlayerToMatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `winnerId` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_PlayerToMatch_B_index";

-- DropIndex
DROP INDEX "_PlayerToMatch_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PlayerToMatch";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MatchPlayers" (
    "match_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    PRIMARY KEY ("match_id", "player_id"),
    CONSTRAINT "MatchPlayers_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayers_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roundId" INTEGER,
    "winnerId" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "Match_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("created_at", "id", "roundId", "updated_at", "winnerId") SELECT "created_at", "id", "roundId", "updated_at", "winnerId" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
CREATE TABLE "new_Tournament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_Tournament" ("created_at", "id", "updated_at") SELECT "created_at", "id", "updated_at" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
