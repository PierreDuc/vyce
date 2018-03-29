import { Persistence } from '@firebase/auth-types';

import { LoginProvider } from '../enums/login-provider.enum';
import { AuthPhase } from '../enums/auth-phase.enum';

export class LoginWithProvider {
  constructor(readonly provider: LoginProvider) {}
}

export class SetPersistence {
  constructor(readonly persistence: Persistence) {}
}

export class SetPhase {
  constructor(readonly phase: AuthPhase) {}
}
