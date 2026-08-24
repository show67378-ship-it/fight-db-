-- AlterTable
ALTER TABLE "Gym" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "admissionFee" INTEGER,
ADD COLUMN     "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "beginnerFriendly" BOOLEAN,
ADD COLUMN     "businessHours" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "googlePlaceId" TEXT,
ADD COLUMN     "headCoach" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "kidsClass" BOOLEAN,
ADD COLUMN     "lastVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "monthlyFeeMax" INTEGER,
ADD COLUMN     "monthlyFeeMin" INTEGER,
ADD COLUMN     "nameEn" TEXT,
ADD COLUMN     "nameKana" TEXT,
ADD COLUMN     "normalizedName" TEXT,
ADD COLUMN     "postalCode" TEXT,
ADD COLUMN     "representative" TEXT,
ADD COLUMN     "trialAvailable" BOOLEAN,
ADD COLUMN     "trialPrice" INTEGER,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "womenClass" BOOLEAN,
ADD COLUMN     "xUrl" TEXT,
ADD COLUMN     "youtube" TEXT;

-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "normalizedName" TEXT,
ADD COLUMN     "officialUrl" TEXT,
ADD COLUMN     "ringName" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymDiscipline" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GymDiscipline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationType" TEXT,
    "country" TEXT,
    "officialUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3),
    "eventDateRaw" TEXT,
    "venue" TEXT,
    "prefecture" TEXT,
    "city" TEXT,
    "address" TEXT,
    "officialUrl" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "fighterRedId" TEXT,
    "fighterBlueId" TEXT,
    "disciplineId" TEXT,
    "weightClass" TEXT,
    "boutOrder" INTEGER,
    "result" TEXT,
    "winnerId" TEXT,
    "method" TEXT,
    "round" INTEGER,
    "time" TEXT,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FighterGym" (
    "id" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "relationshipType" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT true,
    "sourceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FighterGym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlerSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "category" TEXT,
    "disciplineId" TEXT,
    "sourceType" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT false,
    "trustScore" INTEGER NOT NULL DEFAULT 3,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "crawlInterval" TEXT,
    "rateLimitMs" INTEGER NOT NULL DEFAULT 1500,
    "maxConcurrency" INTEGER NOT NULL DEFAULT 1,
    "parserName" TEXT NOT NULL,
    "robotsAllowed" BOOLEAN,
    "lastCrawledAt" TIMESTAMP(3),
    "lastSuccessAt" TIMESTAMP(3),
    "lastErrorAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'idle',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrawlerSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlRun" (
    "id" TEXT NOT NULL,
    "crawlType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'running',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "totalSources" INTEGER NOT NULL DEFAULT 0,
    "completedSources" INTEGER NOT NULL DEFAULT 0,
    "failedSources" INTEGER NOT NULL DEFAULT 0,
    "pagesFetched" INTEGER NOT NULL DEFAULT 0,
    "gymsFound" INTEGER NOT NULL DEFAULT 0,
    "gymsCreated" INTEGER NOT NULL DEFAULT 0,
    "gymsUpdated" INTEGER NOT NULL DEFAULT 0,
    "fightersFound" INTEGER NOT NULL DEFAULT 0,
    "eventsFound" INTEGER NOT NULL DEFAULT 0,
    "fightsFound" INTEGER NOT NULL DEFAULT 0,
    "duplicateCandidates" INTEGER NOT NULL DEFAULT 0,
    "errorsCount" INTEGER NOT NULL DEFAULT 0,
    "dryRun" BOOLEAN NOT NULL DEFAULT false,
    "triggeredBy" TEXT,

    CONSTRAINT "CrawlRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlSourceRun" (
    "id" TEXT NOT NULL,
    "crawlRunId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "pagesFetched" INTEGER NOT NULL DEFAULT 0,
    "recordsFound" INTEGER NOT NULL DEFAULT 0,
    "createdCount" INTEGER NOT NULL DEFAULT 0,
    "updatedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "CrawlSourceRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlUrl" (
    "id" TEXT NOT NULL,
    "crawlRunId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "canonicalUrl" TEXT NOT NULL,
    "urlType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "parentUrl" TEXT,
    "discoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "crawledAt" TIMESTAMP(3),

    CONSTRAINT "CrawlUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlRawRecord" (
    "id" TEXT NOT NULL,
    "crawlRunId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "entityType" TEXT,
    "rawPayload" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CrawlRawRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntitySource" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "current" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EntitySource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DuplicateCandidate" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityAId" TEXT NOT NULL,
    "entityBId" TEXT NOT NULL,
    "matchStrength" TEXT NOT NULL,
    "matchReasons" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,

    CONSTRAINT "DuplicateCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GymDiscipline_gymId_disciplineId_key" ON "GymDiscipline"("gymId", "disciplineId");

-- CreateIndex
CREATE INDEX "Event_organizationId_idx" ON "Event"("organizationId");

-- CreateIndex
CREATE INDEX "Fight_eventId_idx" ON "Fight"("eventId");

-- CreateIndex
CREATE INDEX "FighterGym_fighterId_idx" ON "FighterGym"("fighterId");

-- CreateIndex
CREATE INDEX "FighterGym_gymId_idx" ON "FighterGym"("gymId");

-- CreateIndex
CREATE INDEX "CrawlRun_status_idx" ON "CrawlRun"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CrawlSourceRun_crawlRunId_sourceId_key" ON "CrawlSourceRun"("crawlRunId", "sourceId");

-- CreateIndex
CREATE INDEX "CrawlUrl_status_idx" ON "CrawlUrl"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CrawlUrl_crawlRunId_canonicalUrl_key" ON "CrawlUrl"("crawlRunId", "canonicalUrl");

-- CreateIndex
CREATE INDEX "CrawlRawRecord_contentHash_idx" ON "CrawlRawRecord"("contentHash");

-- CreateIndex
CREATE INDEX "EntitySource_entityType_entityId_fieldName_idx" ON "EntitySource"("entityType", "entityId", "fieldName");

-- CreateIndex
CREATE INDEX "DuplicateCandidate_status_idx" ON "DuplicateCandidate"("status");

-- CreateIndex
CREATE UNIQUE INDEX "DuplicateCandidate_entityType_entityAId_entityBId_key" ON "DuplicateCandidate"("entityType", "entityAId", "entityBId");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_googlePlaceId_key" ON "Gym"("googlePlaceId");

-- CreateIndex
CREATE INDEX "Gym_normalizedName_idx" ON "Gym"("normalizedName");

-- CreateIndex
CREATE INDEX "Gym_prefecture_city_idx" ON "Gym"("prefecture", "city");

-- CreateIndex
CREATE INDEX "Athlete_normalizedName_idx" ON "Athlete"("normalizedName");

-- AddForeignKey
ALTER TABLE "GymDiscipline" ADD CONSTRAINT "GymDiscipline_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymDiscipline" ADD CONSTRAINT "GymDiscipline_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GymDiscipline" ADD CONSTRAINT "GymDiscipline_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "CrawlerSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_fighterRedId_fkey" FOREIGN KEY ("fighterRedId") REFERENCES "Athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_fighterBlueId_fkey" FOREIGN KEY ("fighterBlueId") REFERENCES "Athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Athlete"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FighterGym" ADD CONSTRAINT "FighterGym_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Athlete"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FighterGym" ADD CONSTRAINT "FighterGym_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FighterGym" ADD CONSTRAINT "FighterGym_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "CrawlerSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlSourceRun" ADD CONSTRAINT "CrawlSourceRun_crawlRunId_fkey" FOREIGN KEY ("crawlRunId") REFERENCES "CrawlRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlSourceRun" ADD CONSTRAINT "CrawlSourceRun_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "CrawlerSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlUrl" ADD CONSTRAINT "CrawlUrl_crawlRunId_fkey" FOREIGN KEY ("crawlRunId") REFERENCES "CrawlRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlUrl" ADD CONSTRAINT "CrawlUrl_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "CrawlerSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlRawRecord" ADD CONSTRAINT "CrawlRawRecord_crawlRunId_fkey" FOREIGN KEY ("crawlRunId") REFERENCES "CrawlRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlRawRecord" ADD CONSTRAINT "CrawlRawRecord_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "CrawlerSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntitySource" ADD CONSTRAINT "EntitySource_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "CrawlerSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

