import Express, { Application } from 'express';
import { Server } from 'http';
import { json } from 'body-parser';
import morgan from 'morgan';
import environment from './environment';
import { initRoutes } from './routes';

export class App {
  /** Express application instance */
  private app: Application;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    // Create express application
    this.app = Express();

    // Setup settings
    this.settings();

    // Setup middlewares
    this.middleware();

    // Setup routes
    this.routes();
  }

  settings() {
    // Set port
    this.app.set('port', this.port || environment.PORT || 3000);
  }

  routes() {
    initRoutes(this.app);
  }

  middleware() {
    // Set body-parser middleware for json requests
    this.app.use(json());

    // Set morgan logger
    this.app.use(morgan('dev'));
  }

  close(server: Server) {
    // Close server
    server.close(() => {
      console.info('Server closed');
    });
  }

  start() {
    // Get defined app port
    const port = this.app.get('port');

    // Start express server
    const server = this.app.listen(port);
    console.info('App running on port', port);

    // Define server end callbacks
    process.on('SIGTERM', () => this.close(server));
    process.on('SIGINT', () => this.close(server));
  }
}
