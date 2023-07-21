/* eslint-disable no-undef */
import { Decimal } from '@prisma/client/runtime/library';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { MetricsService } from '../../../src/modules/metrics/service/metrics.service';
import { mockAxios } from '../../__mocks__/axios.mock';
import { PopulatedTribeWithMetrics } from '../../../src/modules/tribe/model/tribe.model';
import { IRepositoryMetricsDTO } from '../../../src/modules/metrics/dtos/metrics.dto';

const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

describe('Organization Service tests', () => {
  beforeEach(() => {
    consoleErrorMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get repositories metrics by tribe id service', () => {
    const prismaResponse: PopulatedTribeWithMetrics = {
      id: 1,
      name: 'Tribe 11                                          ',
      status: 1,
      organizationId: 1,
      repositories: [
        {
          id: 3,
          name: 'Repository 113                                    ',
          state: 'E',
          createTime: new Date('2023-07-21T15:15:50.857Z'),
          status: 'A',
          tribeId: 1,
          metric: {
            repositoryId: 3,
            coverage: new Decimal(0.74),
            bugs: 8,
            vulnerabilities: 6,
            hotspot: 6,
            codeSmells: 10,
          },
        },
        {
          id: 4,
          name: 'Repository 114                                    ',
          state: 'E',
          createTime: new Date('2023-07-21T15:15:50.857Z'),
          status: 'A',
          tribeId: 1,
          metric: {
            repositoryId: 4,
            coverage: new Decimal(0.97),
            bugs: 5,
            vulnerabilities: 8,
            hotspot: 2,
            codeSmells: 6,
          },
        },
      ],
      organization: {
        id: 1,
        name: 'Organization 1                                    ',
        status: 1,
      },
    };

    const httpServiceResponse = {
      success: true,
      data: {
        repositories: [
          {
            id: 3,
            state: 604,
          },
          {
            id: 4,
            state: 605,
          },
        ],
      },
    };

    const expected: IRepositoryMetricsDTO = {
      repositories: [
        {
          id: 3,
          name: 'Repository 113',
          tribe: 'Tribe 11',
          organization: 'Organization 1',
          coverage: '74%',
          codeSmells: 10,
          bugs: 8,
          vulnerabilities: 6,
          hotspots: 6,
          verificationState: 'Verificado',
          state: 'Habilitado',
        },
        {
          id: 4,
          name: 'Repository 114',
          tribe: 'Tribe 11',
          organization: 'Organization 1',
          coverage: '97%',
          codeSmells: 6,
          bugs: 5,
          vulnerabilities: 8,
          hotspots: 2,
          verificationState: 'En espera',
          state: 'Habilitado',
        },
      ],
    };

    it('should return repository metrics correctly', async () => {
      prismaMock.tribe.findUniqueOrThrow.mockResolvedValueOnce(prismaResponse);
      mockAxios.get.mockImplementationOnce(() => Promise.resolve(httpServiceResponse));

      const metricsService = new MetricsService(prismaMock, mockAxios);

      const res = await metricsService.getByTribe(1, 2023, undefined, undefined);
      expect(res).toEqual(expected);
    });

    it('should return repository metrics when one metric is missing', async () => {
      const prismaResponseMissing: PopulatedTribeWithMetrics = {
        ...prismaResponse,
        repositories: [
          {
            id: 3,
            name: 'Repository 113                                    ',
            state: 'E',
            createTime: new Date('2023-07-21T15:15:50.857Z'),
            status: 'A',
            tribeId: 1,
            metric: {
              repositoryId: 3,
              coverage: new Decimal(0.74),
              bugs: 8,
              vulnerabilities: 6,
              hotspot: 6,
              codeSmells: 10,
            },
          },
          {
            id: 4,
            name: 'Repository 114                                    ',
            state: 'E',
            createTime: new Date('2023-07-21T15:15:50.857Z'),
            status: 'A',
            tribeId: 1,
            metric: null,
          },
        ],
      };

      const newExpected: IRepositoryMetricsDTO = {
        repositories: [
          expected.repositories[0],
        ],
      };

      prismaMock.tribe.findUniqueOrThrow.mockResolvedValueOnce(prismaResponseMissing);
      mockAxios.get.mockImplementationOnce(() => Promise.resolve(httpServiceResponse));

      const metricsService = new MetricsService(prismaMock, mockAxios);

      const res = await metricsService.getByTribe(1, 2023, undefined, undefined);
      expect(res).toEqual(newExpected);
    });

    it('should return error if minCoverage is greater than 1', async () => {
      const metricsService = new MetricsService(prismaMock, mockAxios);

      const getPromise = metricsService.getByTribe(1, 2023, undefined, 2);

      await expect(getPromise).rejects.toThrow('El valor de coverage no puede ser mayor a 1.');
    });

    it('should return error if minCoverage is less than 0', async () => {
      const metricsService = new MetricsService(prismaMock, mockAxios);

      const getPromise = metricsService.getByTribe(1, 2023, undefined, -1);

      await expect(getPromise).rejects.toThrow('El valor de coverage no puede ser negativo.');
    });

    it('should return error if tribeId is invalid', async () => {
      const metricsService = new MetricsService(prismaMock, mockAxios);

      const getPromise = metricsService.getByTribe(-1, 2023, undefined, 0.5);

      await expect(getPromise).rejects.toThrow('El id enviado no es válido.');
    });

    it('should return error if no repositories are found', async () => {
      const emptyRepositoriesPrismaResponse: PopulatedTribeWithMetrics = {
        ...prismaResponse,
        repositories: [],
      };
      prismaMock.tribe.findUniqueOrThrow.mockResolvedValueOnce(emptyRepositoriesPrismaResponse);

      const metricsService = new MetricsService(prismaMock, mockAxios);

      const getPromise = metricsService.getByTribe(1, 2023, undefined, undefined);

      await expect(getPromise).rejects.toThrow('La Tribu no tiene repositorios que cumplan con la cobertura necesaria.');
    });

    it('should return error if database throws error', async () => {
      prismaMock.tribe.findUniqueOrThrow.mockRejectedValueOnce({ message: 'Something went wrong' });

      const metricsService = new MetricsService(prismaMock, mockAxios);

      const getPromise = metricsService.getByTribe(1, 2023, undefined, undefined);

      await expect(getPromise).rejects.toThrow('Ocurrió un error al intentar obtener las métricas.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    it('should return not found error if database throws error with code P2025', async () => {
      prismaMock.tribe.findUniqueOrThrow.mockRejectedValueOnce({ message: 'Something went wrong', code: 'P2025' });

      const metricsService = new MetricsService(prismaMock, mockAxios);

      const getPromise = metricsService.getByTribe(1, 2023, undefined, undefined);

      await expect(getPromise).rejects.toThrow('La Tribu no se encuentra registrada.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });
});
