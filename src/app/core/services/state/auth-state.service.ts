import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';

import { Injectable, OnDestroy } from '@angular/core';

import * as firebase from 'firebase/app';
import { User } from '@firebase/auth-types';

import { Store } from '@ngxs/store';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginProvider } from '../../../shared/enums/login-provider.enum';
import { LoginWithProvider, LogoutUser, SetPersistence, UpdateUser } from '../../../shared/actions/auth.action';

@Injectable()
export class AuthStateService implements OnDestroy {
  private readonly destroy: Subject<void> = new Subject<void>();

  constructor(readonly store: Store, readonly af: AngularFireAuth) {
    af.authState.pipe(takeUntil(this.destroy)).subscribe(user => this.updateUser(user));
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
    this.store.dispatch(new UpdateUser(user));
  }
}
