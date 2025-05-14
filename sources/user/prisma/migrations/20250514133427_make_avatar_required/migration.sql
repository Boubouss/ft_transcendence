-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Configuration" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "code2FA" TEXT NOT NULL DEFAULT '',
    "is2FA" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Configuration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Configuration" ("code2FA", "id", "is2FA", "userId") SELECT coalesce("code2FA", '') AS "code2FA", "id", "is2FA", "userId" FROM "Configuration";
DROP TABLE "Configuration";
ALTER TABLE "new_Configuration" RENAME TO "Configuration";
CREATE UNIQUE INDEX "Configuration_userId_key" ON "Configuration"("userId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_User" ("avatar", "created_at", "email", "id", "name", "password", "updated_at") SELECT "avatar", "created_at", "email", "id", "name", "password", "updated_at" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
