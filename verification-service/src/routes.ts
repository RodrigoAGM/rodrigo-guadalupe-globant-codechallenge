import { Application } from 'express';
import { Controller } from './modules/base/controller/controller.base';
import { VerificationController } from './modules/verification/controller/vertification.controller';
import { appContainer } from './config/inversify.container';

const _controllers: Array<Controller> = [
  appContainer.get(VerificationController),
];

const initRoutes = (app: Application) => {
  _controllers.forEach((controller) => {
    app.use(controller.path, controller.getRouter());
  });
};

export { initRoutes };
