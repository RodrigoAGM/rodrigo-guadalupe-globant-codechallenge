import { inject, injectable } from 'inversify';
import { PrismaClient, RepositoryState } from '@prisma/client';
import { ErrorBuilder } from '../../../error/error.builder';
import { IRepositoryMetricsDTO } from '../dtos/metrics.dto';
import { mapMetricByTribeToRepositoryMetricsDto } from '../mapper/tribe.map';
import { HttpService } from '../../../config/http.service';
import { Symbols } from '../../../@types';
import { IVerifiedReposDTO } from '../dtos/verification.dto';

/**
 * Service used to execute Metrics operations
 */
@injectable()
class MetricsService {
  /** Prisma client instance */
  private readonly _client: PrismaClient;

  /** HTTP Service client instance */
  private readonly _httpService: HttpService;

  /**
   * @param {PrismaClient} prismaClient Prisma client
   * @param {HttpService} httpService HTTP Service client
   */
  constructor(
    prismaClient: PrismaClient,
    @inject(Symbols.HttpService) httpService: HttpService
  ) {
    this._httpService = httpService;
    this._client = prismaClient;
  }

  /**
   * Get all repository metrics with the tribeId
   * @param {number} tribeId The id of the tribe to check
   * @param {RepositoryState} repositoryState Filter for repository state (default: Enabled)
   * @param {number} minCoverage Filter for repository min coverage (default: 0.75)
   * @returns {Promise<IRepositoryMetricsDTO>} A Promise with the repositores and its metrics
   */
  async getByTribe(
    tribeId: number,
    creationYear: number,
    repositoryState: RepositoryState = RepositoryState.E,
    minCoverage: number = 0.75,
  ): Promise<IRepositoryMetricsDTO> {
    try {
      if (minCoverage > 1) {
        return Promise.reject(ErrorBuilder.badRequestError('El valor de coverage no puede ser mayor a 1'));
      }

      if (minCoverage < 0) {
        return Promise.reject(ErrorBuilder.badRequestError('El valor de coverage no puede ser negativo'));
      }

      if (tribeId < 0) {
        return Promise.reject(ErrorBuilder.notFoundError('El id enviado no es válido.'));
      }

      const data = await this._client.tribe.findUnique({
        where: { id: tribeId },
        include: {
          repositories: {
            include: { metric: true },
            where: {
              state: repositoryState,
              createTime: {
                gte: new Date(`${creationYear}-01-01`),
                lte: new Date(`${creationYear}-12-31`),
              },
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

      // Get the ids to mock the verification status
      const repositoryIds = data.repositories.map((repo) => (repo.id)).join(',');

      // Request the mocked values of verification status
      const verificationStatus = await this._httpService.get<IVerifiedReposDTO>(`/repos?ids=${repositoryIds}`);

      // Create dictionary with the results
      const verificationDict = Object.fromEntries(verificationStatus.data.repositories.map(
        (x) => [x.id, x.state]
      ));

      const res = mapMetricByTribeToRepositoryMetricsDto(data, verificationDict);
      return Promise.resolve(res);
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Ocurrió un error al intentar obtener las métricas.'));
    }
  }
}

export { MetricsService };
