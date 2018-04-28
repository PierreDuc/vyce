import { auth } from 'firebase';

import { Injectable } from '@angular/core';

import { User } from '@firebase/auth-types';

import { Store } from '@ngxs/store';

import { FirebaseService } from '../../module/firebase/firebase.service';

import { LoginProvider } from '../../../shared/enums/login-provider.enum';
import { LoginUser, LogoutUser } from '../../../shared/actions/user.action';
import { LoginWithProvider, SetPersistence } from '../../../shared/actions/auth.action';
import { HideLogin } from '../../../shared/actions/ui.action';

@Injectable()
export class AuthStateService {
  constructor(private readonly store: Store, private readonly fs: FirebaseService) {
    fs.auth().onAuthStateChanged(user => this.updateUser(user));
  }

  public logout(): Promise<void> {
    return this.fs.auth().signOut();
  }

  public loginWithProvider(provider: LoginProvider): void {
    this.store.dispatch(new LoginWithProvider(provider)).subscribe(() => this.store.dispatch(new HideLogin()));
  }

  public initAuth(): Promise<void> {
    return this.store.dispatch(new SetPersistence(auth.Auth.Persistence.LOCAL)).toPromise();
  }

  private updateUser(user: User | null): void {
    this.store.dispatch(user ? new LoginUser(user) : new LogoutUser());
  }
}
