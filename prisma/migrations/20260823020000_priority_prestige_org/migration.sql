-- AlterTable: 表示優先順位(全体順位・名門度・所属団体・活躍度)用カラムを追加(すべてNULL許容)
ALTER TABLE "Gym" ADD COLUMN "priorityRank" INTEGER,
ADD COLUMN     "prestigeScore" DOUBLE PRECISION;

ALTER TABLE "Athlete" ADD COLUMN "primaryOrganization" TEXT,
ADD COLUMN     "prominenceScore" DOUBLE PRECISION;
