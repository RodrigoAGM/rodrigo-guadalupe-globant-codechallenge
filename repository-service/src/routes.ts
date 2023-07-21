import { Application } from 'express';
import { Controller } from './modules/base/controller/controller.base';
import { appContainer } from './config/inversify.container';
import { MetricsController } from './modules/metrics/controller/metrics.controller';

const _controllers: Array<Controller> = [
  appContainer.get(MetricsController),
];

const initRoutes = (app: Application) => {
  _controllers.forEach((controller) => {
    app.use(controller.path, controller.getRouter());
  });
};

export { initRoutes };
