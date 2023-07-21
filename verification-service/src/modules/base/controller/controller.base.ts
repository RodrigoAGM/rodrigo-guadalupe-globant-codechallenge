/* eslint-disable no-unused-vars */
import {
  Response, Request, NextFunction, Router,
} from 'express';
import { injectable } from 'inversify';
import { HTTPMethods, StatusCodes } from '../../../data/enum';
import { AppError } from '../../../error/app.error';
import { ApiResponse } from '../../../@types';

interface IRoute {
  path: string;
  method: HTTPMethods;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

@injectable()
abstract class Controller {
  public router: Router;

  public abstract path: string;

  protected readonly routes: Array<IRoute> = [];

  constructor() {
    this.router = Router();
  }

  public getRouter(): Router {
    this.routes.forEach((route: IRoute) => {
      switch (route.method) {
        case HTTPMethods.GET:
          this.router.get(route.path, route.handler);
          break;
        case HTTPMethods.POST:
          this.router.post(route.path, route.handler);
          break;
        case HTTPMethods.PUT:
          this.router.put(route.path, route.handler);
          break;
        case HTTPMethods.PATCH:
          this.router.patch(
            route.path,
            route.handler
          );
          break;
        case HTTPMethods.DELETE:
          this.router.delete(
            route.path,
            route.handler
          );
          break;
        default:
          console.error('Not a valid method provided for route');
          break;
      }
    });

    return this.router;
  }

  protected sendSuccess(
    res: Response,
    data: ApiResponse<any>
  ): Response {
    return res.status(StatusCodes.SUCCESS).send(data);
  }

  protected sendError(
    res: Response,
    error: AppError
  ): Response {
    return res.status(error.statusCode || StatusCodes.INTERNAL_ERROR).send(
      error.message || {
        message: 'Something went wrong.',
      }
    );
  }
}

export { Controller };
