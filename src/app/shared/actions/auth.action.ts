import { LoginProvider } from '../enums/login-provider.enum';

export class LoginWithProvider {
  constructor(readonly provider: LoginProvider) {}
}
