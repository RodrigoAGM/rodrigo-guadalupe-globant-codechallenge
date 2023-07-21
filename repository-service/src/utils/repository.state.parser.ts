import { RepositoryState } from '@prisma/client';
import { ErrorBuilder } from '../error/error.builder';

function repositoryStateToNaturalLanguage(state: RepositoryState) {
  let naturalState = '';

  switch (state) {
    case RepositoryState.E: {
      naturalState = 'Habilitado';
      break;
    }
    case RepositoryState.D: {
      naturalState = 'Deshabilitado';
      break;
    }
    case RepositoryState.A: {
      naturalState = 'Archivado';
      break;
    }
  }

  return naturalState;
}

function naturalLanguageTorepositoryState(naturalState: string): RepositoryState {
  let state: RepositoryState;

  const upperState = naturalState.toUpperCase();

  switch (upperState) {
    case 'HABILITADO': {
      state = RepositoryState.E;
      break;
    }
    case 'DESHABILITADO': {
      state = RepositoryState.D;
      break;
    }
    case 'ARCHIVADO': {
      state = RepositoryState.A;
      break;
    }
    default: {
      throw ErrorBuilder.badRequestError(`Invalid state ${naturalState} received`);
    }
  }

  return state;
}

export { repositoryStateToNaturalLanguage, naturalLanguageTorepositoryState };
