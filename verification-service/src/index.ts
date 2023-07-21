import 'reflect-metadata';
import { App } from './app';

const start = async () => {
  const app = new App();
  app.start();
};

start();
