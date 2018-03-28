import { User, Persistence } from '@firebase/auth-types';

import { LoginProvider } from '../enums/login-provider.enum';

export class LoginWithProvider {
  constructor(readonly provider: LoginProvider) {}
}

export class LogoutUser {}

export class SetPersistence {
  constructor(readonly persistence: Persistence) {}
}

export class UpdateUser {
  constructor(readonly user: User | null) {}
}
