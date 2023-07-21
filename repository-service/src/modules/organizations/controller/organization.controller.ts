import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { HTTPMethods } from '../../../data/enum';
import { Controller } from '../../base/controller/controller.base';
import { OrganizationsService } from '../service/organization.service';

@injectable()
class OrganizationsController extends Controller {
  /** Organizations service instance */
  private readonly _service: OrganizationsService;

  path = '/organizations';

  routes = [
    {
      path: '/',
      method: HTTPMethods.GET,
      handler: this.handleGetOrganizations.bind(this),
    },
    {
      path: '/',
      method: HTTPMethods.POST,
      handler: this.handleCreateOrganizations.bind(this),
    },
    {
      path: '/:id',
      method: HTTPMethods.PATCH,
      handler: this.handleUpdateOrganization.bind(this),
    },
    {
      path: '/:id',
      method: HTTPMethods.DELETE,
      handler: this.handleDeleteOrganization.bind(this),
    },
  ];

  /**
   * @param {OrganizationsService} service Organizations service
   */
  constructor(service: OrganizationsService) {
    super();
    this._service = service;
  }

  async handleGetOrganizations(req: Request, res: Response) {
    try {
      const { limit, offset } = req.query;

      const cleanLimit = limit && !Number.isNaN(Number(limit)) ? Number(limit) : undefined;
      const cleanOffset = limit && !Number.isNaN(Number(offset)) ? Number(offset) : undefined;

      // Get data from the service
      const data = await this._service.get(cleanLimit, cleanOffset);

      super.sendSuccess(res, { success: true, data });
    } catch (error: any) {
      console.error('Something went wrong when getting organizations', { error });
      super.sendError(res, error);
    }
  }

  async handleCreateOrganizations(req: Request, res: Response) {
    try {
      const organization = req.body;

      // Get data from the service
      const data = await this._service.create(organization);

      super.sendSuccess(res, { success: true, data });
    } catch (error: any) {
      console.error('Something went wrong when creating an organization', { error });
      super.sendError(res, error);
    }
  }

  async handleUpdateOrganization(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const organization = req.body;

      const cleanId = id && !Number.isNaN(Number(id)) ? Number(id) : -1;

      // Get data from the service
      const data = await this._service.update(cleanId, organization);

      super.sendSuccess(res, { success: true, data });
    } catch (error: any) {
      console.error('Something went wrong when updating an organization', { error });
      super.sendError(res, error);
    }
  }

  async handleDeleteOrganization(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const cleanId = id && !Number.isNaN(Number(id)) ? Number(id) : -1;

      // Get data from the service
      const data = await this._service.delete(cleanId);

      super.sendSuccess(res, { success: true, data });
    } catch (error: any) {
      console.error('Something went wrong when deleting an organization', { error });
      super.sendError(res, error);
    }
  }
}
export { OrganizationsController };
