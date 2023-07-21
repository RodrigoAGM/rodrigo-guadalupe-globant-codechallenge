import { PrismaClient, RepositoryState, RepositoryStatus } from '@prisma/client';

// Create new prisma client
const prisma = new PrismaClient();

function randomNumberFromInterval(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Function used to build Metrics for upsert operations
 * @param coverage Value for coverage
 * @param bugs Number of bugs
 * @param vulnerabilities Number of vulnerabilities
 * @param hotspot Number of hotspots
 * @param codeSmells Number of codesmells
 * @returns Structure to create metrics
 */
const buildMetrics = (
  coverage: number,
  bugs: number,
  vulnerabilities: number,
  hotspot: number,
  codeSmells: number
) => (
  {
    coverage,
    bugs,
    vulnerabilities,
    hotspot,
    codeSmells,
  }
);

/**
 * Function used to build Repositories for upsert operations
 * @param id Identifier to use for the name
 * @param state State of the repository
 * @param status Status of the repository
 * @returns Structure to create repository
 */
const buildRepository = (id: string, state: RepositoryState, status: RepositoryStatus) => (
  {
    name: `Repository ${id}`,
    state,
    status,
    metric: {
      create: {
        ...buildMetrics(
          randomNumberFromInterval(30, 100) / 100,
          randomNumberFromInterval(0, 10),
          randomNumberFromInterval(0, 10),
          randomNumberFromInterval(0, 10),
          randomNumberFromInterval(0, 10),
        ),
      },
    },
  }
);

/**
 * Function used to build Tribe for upsert operations
 * @param id Identifier to use for the name
 * @param status Status of the tribe
 * @returns Structure to create a tribe
 */
const buildTribe = (id: string, status: number) => (
  {
    name: `Tribe ${id}`,
    status,
    repositories: {
      create: [
        buildRepository(`${id}1`, RepositoryState.A, RepositoryStatus.I),
        buildRepository(`${id}2`, RepositoryState.D, RepositoryStatus.I),
        buildRepository(`${id}3`, RepositoryState.E, RepositoryStatus.A),
        buildRepository(`${id}4`, RepositoryState.E, RepositoryStatus.A),
      ],
    },
  }
);

/**
 * Function used to build Organizations for upsert operations
 * @param id ID to use for the new Organizations
 * @returns Query to create a new Organizations
 */
const buildOrganization = (id: number) => ({
  where: { id },
  update: {},
  create: {
    name: `Organization ${id}`,
    status: 1,
    tribes: {
      create: [buildTribe(`${id}1`, 1), buildTribe(`${id}2`, 0)],
    },
  },
});

async function main() {
  // Build 3 initial organizations
  const organization1 = await prisma.organization.upsert(buildOrganization(1));
  const organization2 = await prisma.organization.upsert(buildOrganization(2));
  const organization3 = await prisma.organization.upsert(buildOrganization(3));

  console.log({ organization1, organization2, organization3 });
}

main()
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    // After execution is completed, close connection
    await prisma.$disconnect();
  });
