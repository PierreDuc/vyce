import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { LoginProvider } from '../../../shared/enums/login-provider.enum';
import { LoginWithProvider } from '../../../shared/actions/auth.action';

@Injectable()
export class AuthStateService {
  constructor(readonly store: Store) {}

  public loginWithProvider(provider: LoginProvider): void {
    this.store.dispatch(new LoginWithProvider(provider));
  }
}
