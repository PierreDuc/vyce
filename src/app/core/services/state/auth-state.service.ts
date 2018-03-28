import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { LoginProvider } from '../../../shared/enums/login-provider.enum';
import { LoginWithProvider } from '../../../shared/actions/auth.action';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthStateService {
  constructor(readonly store: Store) {}

  public loginWithProvider(provider: LoginProvider): Observable<any> {
    return this.store.dispatch(new LoginWithProvider(provider));
  }
}
