import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { HTTPMethods } from '../../../data/enum';
import { Controller } from '../../base/controller/controller.base';
import { VerificationService } from '../service/verification.service';

@injectable()
class VerificationController extends Controller {
  /** Verification service instance */
  private readonly _service: VerificationService;

  path = '/';

  routes = [
    {
      path: '/repos',
      method: HTTPMethods.GET,
      handler: this.handleGetRepos.bind(this),
    },
  ];

  /**
   * @param {VerificationService} service Verification service
   */
  constructor(service: VerificationService) {
    super();
    this._service = service;
  }

  async handleGetRepos(req: Request, res: Response) {
    try {
      // Get ids from query to provide a mocked response
      const { ids } = req.query;
      // Parse the received value to an array of strings
      const cleanIds = ids ? ids.toString().split(',') : [];

      // Get data from the service
      const data = await this._service.get(cleanIds);

      super.sendSuccess(res, { success: true, data });
    } catch (error: any) {
      console.error('Something went wrong when getting repositories', { error });
      super.sendError(res, error);
    }
  }
}
export { VerificationController };
