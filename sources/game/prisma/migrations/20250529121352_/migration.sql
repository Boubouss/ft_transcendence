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

    PRIMARY KEY ("match_id", "player_id"),
    CONSTRAINT "MatchPlayers_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "Match" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MatchPlayers_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
