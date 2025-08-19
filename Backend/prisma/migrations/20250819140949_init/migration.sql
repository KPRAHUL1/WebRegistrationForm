-- DropForeignKey
ALTER TABLE "workshops" DROP CONSTRAINT "workshops_createdBy_fkey";

-- AlterTable
ALTER TABLE "workshops" ALTER COLUMN "createdBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "workshops" ADD CONSTRAINT "workshops_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
