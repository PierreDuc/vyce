import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';

import { Injectable } from '@angular/core';

import { User } from '@firebase/auth-types';

import { Actions, ofAction, Store } from '@ngxs/store';

import { FirebaseService } from '../../module/firebase.service';

import { LoginProvider } from '../../../shared/enums/login-provider.enum';
import { LoginUser, LogoutUser } from '../../../shared/actions/user.action';
import { LoginWithProvider, SetPersistence } from '../../../shared/actions/auth.action';

@Injectable()
export class AuthStateService {
  constructor(private readonly store: Store, fs: FirebaseService, actions$: Actions) {
    fs.auth().onAuthStateChanged(user => this.updateUser(user));
    actions$.pipe(ofAction(LogoutUser)).subscribe(() => fs.auth().signOut());
  }

  public loginWithProvider(provider: LoginProvider): Observable<any> {
    return this.store.dispatch(new LoginWithProvider(provider));
  }

  public logoutUser(): void {
    this.store.dispatch(new LogoutUser());
  }

  public initAuth(): Promise<void> {
    return this.store.dispatch(new SetPersistence(firebase.auth.Auth.Persistence.LOCAL)).toPromise();
  }

  private updateUser(user: User | null): void {
    this.store.dispatch(user ? new LoginUser(user) : new LogoutUser());
  }
}
