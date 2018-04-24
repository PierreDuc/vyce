import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Store } from '@ngxs/store';

import { AuthState } from '../../shared/states/auth.state';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(private readonly store: Store) {}

  canLoad(): boolean {
    return this.store.selectSnapshot<boolean>(AuthState.loggedIn);
  }
}
