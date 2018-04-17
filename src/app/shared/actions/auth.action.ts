import { Persistence } from '@firebase/auth-types';

import { LoginProvider } from '../enums/login-provider.enum';
import { AuthPhase } from '../enums/auth-phase.enum';

export class LoginWithProvider {
  static readonly type = '[AUTH] Login using provider';

  constructor(readonly provider: LoginProvider) {}
}

export class SetPersistence {
  static readonly type = '[AUTH] Set persistence of session';

  constructor(readonly persistence: Persistence) {}
}

export class SetPhase {
  static readonly type = '[AUTH] Set current auth phase';

  constructor(readonly phase: AuthPhase) {}
}
