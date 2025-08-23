-- CreateEnum
CREATE TYPE "DeliveryMode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "deliveryMode" "DeliveryMode" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "incharge" TEXT,
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "posterImage" TEXT,
ADD COLUMN     "teacher" TEXT,
ADD COLUMN     "teacherBio" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION,
ADD COLUMN     "venue" TEXT;

-- AlterTable
ALTER TABLE "internships" ADD COLUMN     "deliveryMode" "DeliveryMode" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "incharge" TEXT,
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "posterImage" TEXT,
ADD COLUMN     "supervisor" TEXT,
ADD COLUMN     "supervisorBio" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION,
ADD COLUMN     "venue" TEXT;

-- AlterTable
ALTER TABLE "workshops" ADD COLUMN     "deliveryMode" "DeliveryMode" NOT NULL DEFAULT 'OFFLINE',
ADD COLUMN     "incharge" TEXT,
ADD COLUMN     "meetingLink" TEXT,
ADD COLUMN     "posterImage" TEXT,
ADD COLUMN     "teacher" TEXT,
ADD COLUMN     "teacherBio" TEXT,
ADD COLUMN     "totalAmount" DOUBLE PRECISION,
ADD COLUMN     "venue" TEXT;
