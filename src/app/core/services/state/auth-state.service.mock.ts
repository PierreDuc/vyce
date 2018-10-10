import { User } from '@firebase/auth-types';

import { Injectable } from '@angular/core';

import { LoginProvider } from '../../../shared/enums/login-provider.enum';

@Injectable()
export class MockAuthStateService {
  public logout(): Promise<void> {
    return Promise.resolve();
  }

  public loginWithProvider(provider: LoginProvider): void {}

  public initAuth(): Promise<void> {
    return Promise.resolve();
  }
}
