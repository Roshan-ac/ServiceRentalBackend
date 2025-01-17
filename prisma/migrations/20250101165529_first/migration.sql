-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('DAILY', 'FIXED');

-- CreateEnum
CREATE TYPE "estimatedTimeUnit" AS ENUM ('HOUR', 'DAY', 'WEEK', 'MONTH');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Freelancer" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "availibility" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "hourlyRate" DOUBLE PRECISION,
    "dailyRate" DOUBLE PRECISION,

    CONSTRAINT "Freelancer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "freelancerId" TEXT,
    "customerId" TEXT,

    CONSTRAINT "Avatar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "image" TEXT,
    "caption" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMode" "PaymentMode" NOT NULL,
    "requiredSkills" TEXT[],
    "location" TEXT NOT NULL,
    "estimatedTime" INTEGER NOT NULL,
    "customerId" TEXT,
    "dailyRate" INTEGER,
    "fixedRate" INTEGER,
    "timeUnit" "estimatedTimeUnit" NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "porposal" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,

    CONSTRAINT "porposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "customerId" TEXT,
    "freelancerId" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT[],
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "secondaryEmail" TEXT NOT NULL,
    "customerId" TEXT,
    "freelancerId" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "joinedDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "designation" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "freelancerId" TEXT,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillSet" (
    "id" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "freelancerId" TEXT,

    CONSTRAINT "SkillSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" VARCHAR(6) NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_username_key" ON "Customer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Freelancer_id_key" ON "Freelancer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Freelancer_username_key" ON "Freelancer"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Freelancer_email_key" ON "Freelancer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_id_key" ON "Avatar"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_freelancerId_key" ON "Avatar"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "Avatar_customerId_key" ON "Avatar"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");

-- CreateIndex
CREATE UNIQUE INDEX "porposal_id_key" ON "porposal"("id");

-- CreateIndex
CREATE UNIQUE INDEX "porposal_postId_key" ON "porposal"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_customerId_key" ON "Session"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_freelancerId_key" ON "Session"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_id_key" ON "Contact"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_customerId_key" ON "Contact"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_freelancerId_key" ON "Contact"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkExperience_id_key" ON "WorkExperience"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkExperience_freelancerId_key" ON "WorkExperience"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillSet_id_key" ON "SkillSet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SkillSet_freelancerId_key" ON "SkillSet"("freelancerId");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_sessionId_key" ON "Otp"("sessionId");

-- CreateIndex
CREATE INDEX "Otp_email_createdAt_idx" ON "Otp"("email", "createdAt");

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avatar" ADD CONSTRAINT "Avatar_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "porposal" ADD CONSTRAINT "porposal_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "porposal" ADD CONSTRAINT "porposal_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillSet" ADD CONSTRAINT "SkillSet_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "Freelancer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
