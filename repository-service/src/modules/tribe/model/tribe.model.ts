import { Prisma } from '@prisma/client';

type PopulatedTribe = Prisma.TribeGetPayload<{
  include: { repositories: true, organization: true }
}>

type PopulatedTribeWithMetrics = Prisma.TribeGetPayload<{
  include: { repositories: { include: { metric: true } }, organization: true }
}>

export { PopulatedTribe, PopulatedTribeWithMetrics };
