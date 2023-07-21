import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { HTTPMethods } from '../../../data/enum';
import { Controller } from '../../base/controller/controller.base';
import { MetricsService } from '../service/metrics.service';
import { naturalLanguageTorepositoryState } from '../../../utils/repository.state.parser';

@injectable()
class MetricsController extends Controller {
  /** Metrics service instance */
  private readonly _service: MetricsService;

  path = '/metrics';

  routes = [
    {
      path: '/tribe/:tribeId',
      method: HTTPMethods.GET,
      handler: this.handleGetTribeMetrics.bind(this),
    },
  ];

  /**
   * @param {MetricsService} service Metrics service
   */
  constructor(service: MetricsService) {
    super();
    this._service = service;
  }

  async handleGetTribeMetrics(req: Request, res: Response) {
    try {
      // Get tribe id from params
      const { tribeId } = req.params;

      // Get query
      const { minCoverage, repositoryState } = req.query;

      // Parse the received values
      const cleanId = tribeId ? tribeId.toString() : '';
      const cleanRepositoryState = repositoryState ? naturalLanguageTorepositoryState(
        repositoryState.toString()
      ) : undefined;
      const cleanMinCoverage = minCoverage && !Number.isNaN(Number(minCoverage))
        ? Number(minCoverage) : undefined;

      // Get data from the service
      const data = await this._service.getByTribe(cleanId, cleanRepositoryState, cleanMinCoverage);

      super.sendSuccess(res, { success: true, data });
    } catch (error: any) {
      console.error('Something went wrong when getting metrics', { error });
      super.sendError(res, error);
    }
  }
}
export { MetricsController };
