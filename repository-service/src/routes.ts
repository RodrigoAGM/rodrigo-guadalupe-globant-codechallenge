import { Application } from 'express';
import { Controller } from './modules/base/controller/controller.base';
import { appContainer } from './config/inversify.container';
import { MetricsController } from './modules/metrics/controller/metrics.controller';
import { OrganizationsController } from './modules/organizations/controller/organization.controller';

const _controllers: Array<Controller> = [
  appContainer.get(MetricsController),
  appContainer.get(OrganizationsController),
];

const initRoutes = (app: Application) => {
  _controllers.forEach((controller) => {
    app.use(controller.path, controller.getRouter());
  });
};

export { initRoutes };
