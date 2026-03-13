/*
  Warnings:

  - You are about to drop the column `email` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `client` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Client_email_key` ON `client`;

-- DropIndex
DROP INDEX `Client_phone_key` ON `client`;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `email`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `phone`;
