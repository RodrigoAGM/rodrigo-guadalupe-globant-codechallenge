import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { MetricsService } from '../modules/metrics/service/metrics.service';
import { MetricsController } from '../modules/metrics/controller/metrics.controller';

/** Depency injection container */
const appContainer = new Container();

// Prisma client (Singleton)
appContainer.bind(PrismaClient).toConstantValue(new PrismaClient());

// Transaction (Transient)
appContainer.bind(MetricsService).toSelf();
appContainer.bind(MetricsController).toSelf();

export { appContainer };
