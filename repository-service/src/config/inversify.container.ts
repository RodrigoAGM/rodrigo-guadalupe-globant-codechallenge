import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { HttpService } from './http.service';
import { MetricsService } from '../modules/metrics/service/metrics.service';
import { MetricsController } from '../modules/metrics/controller/metrics.controller';
import { AxiosService } from './axios.http.service';
import environment from '../environment';
import { Symbols } from '../@types';
import { OrganizationsService } from '../modules/organizations/service/organization.service';
import { OrganizationsController } from '../modules/organizations/controller/organization.controller';

/** Depency injection container */
const appContainer = new Container();

// Prisma client (Singleton)
appContainer.bind(PrismaClient).toConstantValue(new PrismaClient());

// HttpService client (Singleton)
appContainer.bind<HttpService>(Symbols.HttpService).toConstantValue(new AxiosService(environment.VERIFICATION_SERVICE_URL ?? ''));

// Metrics (Transient)
appContainer.bind(MetricsService).toSelf();
appContainer.bind(MetricsController).toSelf();

// Organizations (Transient)
appContainer.bind(OrganizationsService).toSelf();
appContainer.bind(OrganizationsController).toSelf();

export { appContainer };
