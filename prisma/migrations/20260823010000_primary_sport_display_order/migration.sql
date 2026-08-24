-- AlterTable: 主要ジャンル・表示順の手動調整用カラムを追加(すべてNULL許容の追加のみ)
ALTER TABLE "Gym" ADD COLUMN "primarySport" TEXT,
ADD COLUMN     "displayOrder" INTEGER;

ALTER TABLE "Athlete" ADD COLUMN "displayOrder" INTEGER;
