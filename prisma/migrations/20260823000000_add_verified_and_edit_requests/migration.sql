-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nameKana" TEXT,
ADD COLUMN     "primarySport" TEXT,
ADD COLUMN     "priorityRank" INTEGER,
ADD COLUMN     "displayOrder" INTEGER,
ADD COLUMN     "prestigeScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "displayOrder" INTEGER,
ADD COLUMN     "primaryOrganization" TEXT,
ADD COLUMN     "prominenceScore" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "EditRequest" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EditRequest_pkey" PRIMARY KEY ("id")
);
