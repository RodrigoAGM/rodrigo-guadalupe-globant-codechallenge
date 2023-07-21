/* eslint-disable no-undef */
import { Organization } from '@prisma/client';
import { prismaMock } from '../../__mocks__/prisma.mock';
import { OrganizationsService } from '../../../src/modules/organizations/service/organization.service';
import { IOrganizationCreateDTO, IOrganizationDTO } from '../../../src/modules/organizations/dtos/organization.dto';

const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });

describe('Organization Service tests', () => {
  beforeEach(() => {
    consoleErrorMock.mockClear();
  });

  // Tests to get all organizations
  describe('Get all organizations service', () => {
    it('should get organizations correctly', async () => {
      const prismaResponse: Organization[] = [
        {
          id: 1,
          name: 'Organization 1         ',
          status: 1,
        },
        {
          id: 2,
          name: 'Organization 2         ',
          status: 1,
        },
        {
          id: 3,
          name: 'Organization 3         ',
          status: 1,
        },
      ];

      const expected: IOrganizationDTO[] = [
        {
          id: 1,
          name: 'Organization 1',
          status: 1,
        },
        {
          id: 2,
          name: 'Organization 2',
          status: 1,
        },
        {
          id: 3,
          name: 'Organization 3',
          status: 1,
        },
      ];

      prismaMock.organization.findMany.mockResolvedValueOnce(prismaResponse);

      const organizationService = new OrganizationsService(prismaMock);

      const res = await organizationService.get();

      expect(res).toStrictEqual(expected);
    });

    it('should get organizations correctly with limit and offset', async () => {
      const prismaResponse: Organization[] = [
        {
          id: 1,
          name: 'Organization 1         ',
          status: 1,
        },
        {
          id: 2,
          name: 'Organization 2         ',
          status: 1,
        },
      ];

      const expected: IOrganizationDTO[] = [
        {
          id: 1,
          name: 'Organization 1',
          status: 1,
        },
        {
          id: 2,
          name: 'Organization 2',
          status: 1,
        },
      ];

      prismaMock.organization.findMany.mockResolvedValueOnce(prismaResponse);

      const organizationService = new OrganizationsService(prismaMock);

      const res = await organizationService.get(2, 0);

      expect(res).toStrictEqual(expected);
    });

    it('should return error if database throws error', async () => {
      prismaMock.organization.findUnique.mockRejectedValueOnce({ message: 'Something went wrong' });

      const organizationService = new OrganizationsService(prismaMock);

      await expect(organizationService.get()).rejects.toThrow('Ocurrió un error al intentar obtener las organizaciones.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  // Tests for create Organization service
  describe('Create organization service', () => {
    const prismaResponse: Organization = {
      id: 1,
      name: 'Organization Test         ',
      status: 1,
    };

    const correctInput: IOrganizationCreateDTO = {
      name: 'Organization Test',
      status: 1,
    };

    it('should create an organization correctly', async () => {
      const expected: IOrganizationDTO = {
        ...prismaResponse,
        name: prismaResponse.name.trim(),
      };

      prismaMock.organization.create.mockResolvedValueOnce(prismaResponse);

      const organizationService = new OrganizationsService(prismaMock);

      const res = await organizationService.create(correctInput);
      expect(res).toEqual(expected);
    });

    it('should return error if organization name is too big', async () => {
      const wrongTypeInput: IOrganizationCreateDTO = {
        ...correctInput,
        name: 'ThisIsAVeryVeryBigLongAndLargeOrganizationName',
      };

      prismaMock.organization.create.mockRejectedValueOnce({ message: 'Something went wrong' });

      const organizationService = new OrganizationsService(prismaMock);

      const createPromise = organizationService.create(wrongTypeInput);
      await expect(createPromise).rejects.toThrow('Ocurrió un error al crear la organización.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    it('should return error if database throws error', async () => {
      prismaMock.organization.create.mockRejectedValueOnce({ message: 'Something went wrong' });

      const organizationService = new OrganizationsService(prismaMock);

      const createPromise = organizationService.create(correctInput);
      await expect(createPromise).rejects.toThrow('Ocurrió un error al crear la organización.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  // Tests for update organization service
  describe('Update organization service', () => {
    const prismaResponse: Organization = {
      id: 1,
      name: 'Updated Organization Test         ',
      status: 1,
    };

    it('should update organization correctly', async () => {
      const expected: IOrganizationDTO = {
        ...prismaResponse,
        name: prismaResponse.name.trim(),
      };

      prismaMock.organization.update.mockResolvedValueOnce(prismaResponse);

      const organizationService = new OrganizationsService(prismaMock);

      const res = await organizationService.update(1, { name: 'Updated Organization Test' });
      expect(res).toEqual(expected);
    });

    it('should return error if invalid id is provided', async () => {
      prismaMock.organization.update.mockRejectedValueOnce({ message: 'Something went wrong' });

      const organizationService = new OrganizationsService(prismaMock);

      const updatePromise = organizationService.update(-1, { name: 'Updated Organization Test' });

      await expect(updatePromise).rejects.toThrow('El id enviado no es válido.');
    });

    it('should return not found error if database throws error with code P2025', async () => {
      prismaMock.organization.update.mockRejectedValueOnce({ message: 'Something went wrong', code: 'P2025' });

      const organizationService = new OrganizationsService(prismaMock);

      const updatePromise = organizationService.update(1, { name: 'Updated Organization Test' });

      await expect(updatePromise).rejects.toThrow('La organización no se encuentra registrada.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    it('should return error if database throws error', async () => {
      prismaMock.organization.update.mockRejectedValueOnce({ message: 'Something went wrong' });

      const organizationService = new OrganizationsService(prismaMock);

      const updatePromise = organizationService.update(1, { status: 1 });

      await expect(updatePromise).rejects.toThrow('Ocurrió un error al actualizar la organización.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });

  // Tests for delete organization service
  describe('Delete organization service', () => {
    const prismaResponse: Organization = {
      id: 1,
      name: 'Updated Organization Test         ',
      status: 1,
    };

    it('should delete organization correctly', async () => {
      prismaMock.organization.delete.mockResolvedValueOnce(prismaResponse);

      const organizationService = new OrganizationsService(prismaMock);

      const res = await organizationService.delete(1);
      expect(res).toEqual(true);
    });

    it('should return error if invalid id is provided', async () => {
      prismaMock.organization.delete.mockRejectedValueOnce({ message: 'Something went wrong' });

      const organizationService = new OrganizationsService(prismaMock);

      const updatePromise = organizationService.delete(-1);

      await expect(updatePromise).rejects.toThrow('El id enviado no es válido.');
    });

    it('should return not found error if database throws error with code P2025', async () => {
      prismaMock.organization.delete.mockRejectedValueOnce({ message: 'Something went wrong', code: 'P2025' });

      const organizationService = new OrganizationsService(prismaMock);

      const updatePromise = organizationService.delete(1);

      await expect(updatePromise).rejects.toThrow('La organización no se encuentra registrada.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });

    it('should return error if database throws error', async () => {
      prismaMock.organization.delete.mockRejectedValueOnce({ message: 'Something went wrong' });

      const organizationService = new OrganizationsService(prismaMock);

      const updatePromise = organizationService.delete(1);

      await expect(updatePromise).rejects.toThrow('Ocurrió un error al eliminar la organización.');
      expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    });
  });
});
