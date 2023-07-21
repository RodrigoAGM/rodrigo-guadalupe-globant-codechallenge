import { RepositoryState } from '@prisma/client';
import { repositoryStateToNaturalLanguage, naturalLanguageTorepositoryState } from '../../src/utils/repository.state.parser';
import { verificationStateToNaturalLanguage } from '../../src/utils/verification.state.parser';

/* eslint-disable no-undef */
describe('Utils tests', () => {
  describe('repositoryStateToNaturalLanguage util', () => {
    it('Should return correct value for State E', () => {
      const state = repositoryStateToNaturalLanguage(RepositoryState.E);

      expect(state).toStrictEqual('Habilitado');
    });

    it('Should return correct value for State D', () => {
      const state = repositoryStateToNaturalLanguage(RepositoryState.D);

      expect(state).toStrictEqual('Deshabilitado');
    });

    it('Should return correct value for State A', () => {
      const state = repositoryStateToNaturalLanguage(RepositoryState.A);

      expect(state).toStrictEqual('Archivado');
    });
  });

  describe('naturalLanguageTorepositoryState util', () => {
    it('Should return correct value for state Habilitado', () => {
      const state = naturalLanguageTorepositoryState('Habilitado');

      expect(state).toStrictEqual(RepositoryState.E);
    });

    it('Should return correct value for state Deshabilitado', () => {
      const state = naturalLanguageTorepositoryState('Deshabilitado');

      expect(state).toStrictEqual(RepositoryState.D);
    });

    it('Should return correct value for state Archivado', () => {
      const state = naturalLanguageTorepositoryState('Archivado');

      expect(state).toStrictEqual(RepositoryState.A);
    });

    it('Should throw error if state does not exist', () => {
      try {
        naturalLanguageTorepositoryState('NOEXIST');
      } catch (error: any) {
        expect(error.message).toStrictEqual('Invalid state NOEXIST received');
      }
    });
  });

  describe('verificationStateToNaturalLanguage util', () => {
    it('Should return correct value for state 604', () => {
      const state = verificationStateToNaturalLanguage(604);

      expect(state).toStrictEqual('Verificado');
    });

    it('Should return correct value for state 605', () => {
      const state = verificationStateToNaturalLanguage(605);

      expect(state).toStrictEqual('En espera');
    });

    it('Should return correct value for state 606', () => {
      const state = verificationStateToNaturalLanguage(606);

      expect(state).toStrictEqual('Aprobado');
    });

    it('Should return "En espera" for any other state value', () => {
      const state = verificationStateToNaturalLanguage(700);

      expect(state).toStrictEqual('En espera');
    });
  });
});
