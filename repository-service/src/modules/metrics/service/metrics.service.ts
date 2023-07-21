import { injectable } from 'inversify';
import { PrismaClient, RepositoryState } from '@prisma/client';
import { ErrorBuilder } from '../../../error/error.builder';
import { IRepositoryMetricsDTO } from '../dtos/metrics.dto';
import { mapMetricByTribeToRepositoryMetricsDto } from '../mapper/tribe.map';

/**
 * Service used to execute Metrics operations
 */
@injectable()
class MetricsService {
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

  /**
   * Get all repository metrics with the tribeId
   * @param {string} tribeId The id of the tribe to check
   * @param {RepositoryState} repositoryState Filter for repository state (default: Enabled)
   * @param {number} minCoverage Filter for repository min coverage (default: 0.75)
   * @returns {Promise<IRepositoryMetricsDTO>} A Promise with the repositores and its metrics
   */
  async getByTribe(
    tribeId: string,
    repositoryState: RepositoryState = RepositoryState.E,
    minCoverage: number = 0.75
  ): Promise<IRepositoryMetricsDTO> {
    try {
      if (minCoverage > 1) {
        return Promise.reject(ErrorBuilder.badRequestError('El valor de coverage no puede ser mayor a 1'));
      }

      if (minCoverage < 0) {
        return Promise.reject(ErrorBuilder.badRequestError('El valor de coverage no puede ser negativo'));
      }

      const parsedTribeId = !Number.isNaN(Number(tribeId)) ? Number(tribeId) : null;

      if (!parsedTribeId) {
        return Promise.reject(ErrorBuilder.badRequestError('El id proporcionado es inválido.'));
      }

      console.log(parsedTribeId);

      const data = await this._client.tribe.findUnique({
        where: { id: parsedTribeId },
        include: {
          repositories: {
            include: { metric: true },
            where: {
              state: repositoryState,
              metric: { coverage: { gte: minCoverage } },
            },
          },
          organization: true,
        },
      });

      if (!data) {
        return Promise.reject(ErrorBuilder.notFoundError('La Tribu no se encuentra registrada.'));
      }

      if (data.repositories.length === 0) {
        return Promise.reject(ErrorBuilder.notFoundError('La Tribu no tiene repositorios que cumplan con la cobertura necesaria.'));
      }

      const res = mapMetricByTribeToRepositoryMetricsDto(data);
      return Promise.resolve(res);
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Ocurrió un error al intentar obtener las métricas.'));
    }
  }
}

export { MetricsService };
