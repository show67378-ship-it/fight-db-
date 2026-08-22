-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sports" TEXT[],
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "contactEmail" TEXT,
    "trialInfo" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "planTier" TEXT NOT NULL DEFAULT 'free',
    "description" TEXT NOT NULL,
    "instructors" JSONB,
    "websiteUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Athlete" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameKana" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "organizations" TEXT[],
    "photo" TEXT NOT NULL,
    "birthdate" TEXT,
    "heightCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,
    "reachCm" DOUBLE PRECISION,
    "weightClass" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "gymId" TEXT,
    "gymNote" TEXT,
    "bio" TEXT,
    "nickname" TEXT,
    "signatureMove" TEXT,
    "fightingStyle" TEXT,
    "stance" TEXT,
    "backbone" TEXT,
    "sns" JSONB NOT NULL DEFAULT '[]',
    "record" JSONB,
    "recordNote" TEXT,
    "sourceUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "athleteAId" TEXT NOT NULL,
    "athleteBId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "votesA" INTEGER NOT NULL DEFAULT 0,
    "votesB" INTEGER NOT NULL DEFAULT 0,
    "resultWinnerId" TEXT,
    "sourceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DreamMatchCard" (
    "id" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "athleteAId" TEXT NOT NULL,
    "athleteBId" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DreamMatchCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrialApplication" (
    "id" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "preferredDate" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrialApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GymListingRequest" (
    "id" TEXT NOT NULL,
    "gymName" TEXT NOT NULL,
    "sports" TEXT[],
    "prefecture" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "websiteUrl" TEXT,
    "description" TEXT,
    "contactName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GymListingRequest_pkey" PRIMARY KEY ("id")
);
