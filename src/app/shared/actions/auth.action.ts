import { Persistence } from '@firebase/auth-types';

import { LoginProvider } from '../enums/login-provider.enum';
import { AuthPhase } from '../enums/auth-phase.enum';

export class LoginWithProvider {
  static type = '[AUTH] Login using provider';

  constructor(readonly provider: LoginProvider) {}
}

export class SetPersistence {
  static type = '[AUTH] Set persistence of session';

  constructor(readonly persistence: Persistence) {}
}

export class SetPhase {
  static type = '[AUTH] Set current auth phase';

  constructor(readonly phase: AuthPhase) {}
}
