import * as firebase from 'firebase/app';

import { Action, Selector, State, StateContext } from '@ngxs/store';

import { LoginWithProvider, SetPersistence, SetPhase } from '../actions/auth.action';
import { LoginProvider } from '../enums/login-provider.enum';
import { AuthPhase } from '../enums/auth-phase.enum';
import { FirebaseService } from '../../core/module/firebase.service';

export interface AuthStateModel {
  phase: AuthPhase;
  provider?: LoginProvider;
  persistence?: firebase.auth.Auth.Persistence;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    phase: AuthPhase.LoggedOut
  }
})
export class AuthState<T extends StateContext<AuthStateModel>> {
  private authProviders: { [k in LoginProvider]: { new (): firebase.auth.AuthProvider } } = {
    [LoginProvider.Google]: firebase.auth.GoogleAuthProvider,
    [LoginProvider.Facebook]: firebase.auth.FacebookAuthProvider
  };

  constructor(readonly fs: FirebaseService) {}

  @Selector()
  static loggedIn(state: AuthStateModel): boolean {
    return state.phase === AuthPhase.LoggedIn;
  }

  @Action(SetPersistence)
  async setPersistence({ patchState }: T, { persistence }: SetPersistence): Promise<void> {
    await this.fs.auth().setPersistence(persistence);

    patchState({ persistence });
  }

  @Action(LoginWithProvider)
  async loginWithProvider({ patchState, dispatch }: T, { provider }: LoginWithProvider): Promise<void> {
    patchState({ provider });
    dispatch(new SetPhase(AuthPhase.Authenticating));

    await this.fs.auth().signInWithPopup(new this.authProviders[provider]());
  }

  @Action(SetPhase)
  setPhase({ patchState }: T, { phase }: SetPhase): void {
    patchState({ phase });
  }
}
