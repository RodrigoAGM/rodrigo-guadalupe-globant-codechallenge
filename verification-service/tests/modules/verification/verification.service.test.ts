/* eslint-disable no-undef */
import 'reflect-metadata';
import { IVerifiedReposDTO } from '../../../src/modules/verification/dtos/verification.dto';
import { VerificationService } from '../../../src/modules/verification/service/verification.service';
import { verificationStatusMock } from '../../../src/mock/verification.status.mock';

describe('Verification Service tests', () => {
  // Tests for get repositories verification status
  describe('Get repositories verification status', () => {
    it('should get repositories correctly', async () => {
      const ids = ['1', '2', '3', '4'];

      const expected: IVerifiedReposDTO = {
        repositories: [
          { id: 1, state: verificationStatusMock[1] ?? 605 },
          { id: 2, state: verificationStatusMock[2] ?? 605 },
          { id: 3, state: verificationStatusMock[3] ?? 605 },
          { id: 4, state: verificationStatusMock[4] ?? 605 },
        ],
      };

      const verificationService = new VerificationService();

      const res = await verificationService.get(ids);

      expect(res).toStrictEqual(expected);
    });

    it('should return error if no ids provided', async () => {
      const verificationService = new VerificationService();

      await expect(verificationService.get([])).rejects.toThrow('No se han enviado ids válidas.');
    });

    it('should get repositories correctly with some invalid ids', async () => {
      const ids = ['1', '', '3', '4', 'cc'];

      const expected: IVerifiedReposDTO = {
        repositories: [
          { id: 1, state: verificationStatusMock[1] ?? 605 },
          { id: 3, state: verificationStatusMock[3] ?? 605 },
          { id: 4, state: verificationStatusMock[4] ?? 605 },
        ],
      };

      const verificationService = new VerificationService();

      const res = await verificationService.get(ids);

      expect(res).toStrictEqual(expected);
    });

    it('should get repositories correctly with not found ids', async () => {
      const ids = ['1', '3', '4', '134'];

      const expected: IVerifiedReposDTO = {
        repositories: [
          { id: 1, state: verificationStatusMock[1] ?? 605 },
          { id: 3, state: verificationStatusMock[3] ?? 605 },
          { id: 4, state: verificationStatusMock[4] ?? 605 },
          { id: 134, state: 605 },
        ],
      };

      const verificationService = new VerificationService();

      const res = await verificationService.get(ids);

      expect(res).toStrictEqual(expected);
    });
  });
});
