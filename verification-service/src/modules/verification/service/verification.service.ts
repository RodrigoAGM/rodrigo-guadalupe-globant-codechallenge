import { injectable } from 'inversify';
import { IVerifiedRepoDTO, IVerifiedReposDTO } from '../dtos/verification.dto';
import { randomNumberFromInterval } from '../../../utils/random.value';
import { ErrorBuilder } from '../../../error/error.builder';

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
        // Validate if value is a number
        if (Number.isNaN(Number(id))) return;

        // Get random value between 604 and 606
        const state = randomNumberFromInterval(604, 606);

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
