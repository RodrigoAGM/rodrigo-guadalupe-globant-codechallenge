import { injectable } from 'inversify';
import { IVerifiedRepoDTO, IVerifiedReposDTO } from '../dtos/verification.dto';
import { ErrorBuilder } from '../../../error/error.builder';
import { verificationStatusMock } from '../../../mock/verification.status.mock';

/**
 * Service used to execute Verification operations
 */
@injectable()
class VerificationService {
  /**
   * Get all repositories with its state
   * @param {string} ids The id of the repositories to check
   * @returns {Promise<IVerifiedReposDTO>} A Promise with the repositores and its state
   */
  async get(ids: string[]): Promise<IVerifiedReposDTO> {
    try {
      const repositories: IVerifiedRepoDTO[] = [];

      // Iterate the received ids to return a mocked response
      ids.forEach((id) => {
        if (!id) return;

        // Get verification status
        const state = verificationStatusMock[id] ?? 605;

        repositories.push({ id: Number(id), state });
      });

      return Promise.resolve({ repositories });
    } catch (error) {
      console.error(error);
      return Promise.reject(ErrorBuilder.internalError('Error while getting transaction'));
    }
  }
}

export { VerificationService };
