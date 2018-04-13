import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';

import { Injectable, OnDestroy } from '@angular/core';

import * as firebase from 'firebase/app';
import { User } from '@firebase/auth-types';

import { Actions, ofAction, Store } from '@ngxs/store';

import { LoginProvider } from '../../../shared/enums/login-provider.enum';
import { LoginWithProvider, SetPersistence } from '../../../shared/actions/auth.action';
import { LoginUser, LogoutUser } from '../../../shared/actions/user.action';
import { FirebaseService } from '../../module/firebase.service';

@Injectable()
export class AuthStateService implements OnDestroy {
  private destroy: Subject<void> = new Subject<void>();

  constructor(readonly store: Store, readonly fs: FirebaseService, readonly actions$: Actions) {
    fs.auth().onAuthStateChanged(user => this.updateUser(user));
    this.actions$.pipe(takeUntil(this.destroy), ofAction(LogoutUser)).subscribe(() => fs.auth().signOut());
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
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
    if (user) {
      this.store.dispatch(new LoginUser(user));
    } else {
      this.store.dispatch(new LogoutUser());
    }
  }
}
