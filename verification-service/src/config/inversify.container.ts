import { Container } from 'inversify';
import { VerificationService } from '../modules/verification/service/verification.service';
import { VerificationController } from '../modules/verification/controller/vertification.controller';

/** Depency injection container */
const appContainer = new Container();

// Transaction (Transient)
appContainer.bind(VerificationService).toSelf();
appContainer.bind(VerificationController).toSelf();

export { appContainer };
