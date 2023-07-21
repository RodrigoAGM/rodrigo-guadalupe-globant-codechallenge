-- CreateEnum
CREATE TYPE "RepositoryState" AS ENUM ('E', 'A', 'D');

-- CreateEnum
CREATE TYPE "RepositoryStatus" AS ENUM ('I', 'A');

-- CreateTable
CREATE TABLE "Organization" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" CHAR(50) NOT NULL,
    "status" INT4 NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tribe" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" CHAR(50) NOT NULL,
    "status" INT4 NOT NULL,
    "organizationId" INT8 NOT NULL,

    CONSTRAINT "Tribe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" CHAR(50) NOT NULL,
    "state" "RepositoryState" NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "RepositoryStatus" NOT NULL,
    "tribeId" INT8 NOT NULL,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metric" (
    "repositoryId" INT8 NOT NULL,
    "coverage" DECIMAL(65,30) NOT NULL,
    "bugs" INT4 NOT NULL,
    "vulnerabilities" INT4 NOT NULL,
    "hotspot" INT4 NOT NULL,
    "codeSmells" INT4 NOT NULL,

    CONSTRAINT "Metric_pkey" PRIMARY KEY ("repositoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metric_repositoryId_key" ON "Metric"("repositoryId");

-- AddForeignKey
ALTER TABLE "Tribe" ADD CONSTRAINT "Tribe_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_tribeId_fkey" FOREIGN KEY ("tribeId") REFERENCES "Tribe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Metric" ADD CONSTRAINT "Metric_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
