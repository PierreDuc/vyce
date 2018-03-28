import * as firebase from "firebase/app";

import { Action, State, StateContext } from '@ngxs/store';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from '../interface/user.interface';
import { LoginWithProvider } from '../actions/auth.action';
import { LoginProvider } from '../enums/login-provider.enum';

export interface AuthStateModel {
  user?: User;
  state: number;
  provider?: LoginProvider;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    state: 0
  }
})
export class AuthState {

  private readonly authProviders: {[k in LoginProvider]: {new(): firebase.auth.AuthProvider}} = {
    [LoginProvider.Google]: firebase.auth.GoogleAuthProvider,
    [LoginProvider.Facebook]: firebase.auth.FacebookAuthProvider
  };

  constructor(readonly afAuth: AngularFireAuth) {}

  @Action(LoginWithProvider)
  async loginWithProvider(
    { patchState }: StateContext<AuthStateModel>,
    { provider }: LoginWithProvider
  ): Promise<void> {
    patchState({
      provider
    });

    const what = await this.afAuth.auth.signInWithPopup(new this.authProviders[provider]());
    console.log(what);
  }
}
