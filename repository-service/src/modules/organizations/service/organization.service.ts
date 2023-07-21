import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { ErrorBuilder } from '../../../error/error.builder';
import { IOrganizationCreateDTO, IOrganizationDTO } from '../dtos/organization.dto';
import { mapOrganizationToOrganizationDto, mapOrganizationsToOrganizationDtoList } from '../mapper/organization.mapper';

/**
 * Service used to execute Organizations operations
 */
@injectable()
class OrganizationsService {
  /** Prisma client instance */
  private readonly _client: PrismaClient;

  /**
   * @param {PrismaClient} prismaClient Prisma client
   */
  constructor(
    prismaClient: PrismaClient,
  ) {
    this._client = prismaClient;
  }

  async get(
    limit: number = 10,
    offset: number = 0
  ): Promise<IOrganizationDTO[]> {
    try {
      const data = await this._client.organization.findMany({ take: limit, skip: offset });

      const res = mapOrganizationsToOrganizationDtoList(data);

      return Promise.resolve(res);
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Ocurrió un error al intentar obtener las organizaciones.'));
    }
  }

  async create(organization: IOrganizationCreateDTO): Promise<IOrganizationDTO> {
    try {
      const data = await this._client.organization.create({ data: organization });

      const res = mapOrganizationToOrganizationDto(data);

      return Promise.resolve(res);
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Ocurrió un error al crear la organización.'));
    }
  }

  async update(
    id: number,
    organization: Partial<IOrganizationCreateDTO>
  ): Promise<IOrganizationDTO> {
    try {
      if (id < 0) {
        return Promise.reject(ErrorBuilder.notFoundError('El id enviado no es válido.'));
      }

      const data = await this._client.organization.update({ where: { id }, data: organization });

      const res = mapOrganizationToOrganizationDto(data);

      return Promise.resolve(res);
    } catch (error: any) {
      console.error(error);
      if (error.code && error.code === 'P2025') {
        return Promise.reject(ErrorBuilder.notFoundError('La organización no se encuentra registrada.'));
      }
      return Promise.reject(ErrorBuilder.internalError('Ocurrió un error al actualizar la organización.'));
    }
  }

  async delete(
    id: number
  ): Promise<Boolean> {
    try {
      if (id < 0) {
        return Promise.reject(ErrorBuilder.notFoundError('El id enviado no es válido.'));
      }

      await this._client.organization.delete({ where: { id } });

      return Promise.resolve(true);
    } catch (error: any) {
      console.error(error);
      if (error.code && error.code === 'P2025') {
        return Promise.reject(ErrorBuilder.notFoundError('La organización no se encuentra registrada.'));
      }
      return Promise.reject(ErrorBuilder.internalError('Ocurrió un error al eliminar la organización.'));
    }
  }
}

export { OrganizationsService };
