import { Application } from 'express';
import { Controller } from './modules/base/controller/controller.base';

const _controllers: Array<Controller> = [
];

const initRoutes = (app: Application) => {
  _controllers.forEach((controller) => {
    app.use(controller.path, controller.getRouter());
  });
};

export { initRoutes };
