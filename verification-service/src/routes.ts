import { Application } from 'express';
import { Controller } from './modules/base/controller/controller.base';
import { VerificationController } from './modules/verification/controller/vertification.controller';

const _controllers: Array<Controller> = [
  new VerificationController(),
];

const initRoutes = (app: Application) => {
  _controllers.forEach((controller) => {
    app.use(controller.path, controller.getRouter());
  });
};

export { initRoutes };
