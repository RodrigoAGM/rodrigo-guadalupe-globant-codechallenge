function verificationStateToNaturalLanguage(state: number) {
  let naturalState = '';

  switch (state) {
    case 604: {
      naturalState = 'Verificado';
      break;
    }
    case 605: {
      naturalState = 'En espera';
      break;
    }
    case 606: {
      naturalState = 'Aprobado';
      break;
    }
    default: {
      naturalState = 'En espera';
    }
  }

  return naturalState;
}

export { verificationStateToNaturalLanguage };
