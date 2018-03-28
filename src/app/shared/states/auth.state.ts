import * as firebase from 'firebase/app';

import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AngularFireAuth } from 'angularfire2/auth';

import { IUser } from '../interface/user.interface';
import { LoginWithProvider, LogoutUser, SetPersistence, UpdateUser } from '../actions/auth.action';
import { LoginProvider } from '../enums/login-provider.enum';
import { AuthPhase } from '../enums/auth-phase.enum';
import { HideLogin } from '../actions/ui.action';

export interface AuthStateModel {
  user: IUser | null;
  phase: AuthPhase;
  provider?: LoginProvider;
  persistence?: firebase.auth.Auth.Persistence;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    phase: AuthPhase.LoggedOut,
    user: null
  }
})
export class AuthState<T extends StateContext<AuthStateModel>> {
  private readonly authProviders: { [k in LoginProvider]: { new (): firebase.auth.AuthProvider } } = {
    [LoginProvider.Google]: firebase.auth.GoogleAuthProvider,
    [LoginProvider.Facebook]: firebase.auth.FacebookAuthProvider
  };

  @Selector()
  static user(state: AuthStateModel): IUser | null {
    return state.user;
  }

  constructor(readonly afAuth: AngularFireAuth) {}

  @Action(SetPersistence)
  async setPersistence({ patchState }: T, { persistence }: SetPersistence): Promise<void> {
    await this.afAuth.auth.setPersistence(persistence);

    patchState({ persistence });
  }

  @Action(LoginWithProvider)
  async loginWithProvider({ patchState, dispatch }: T, { provider }: LoginWithProvider): Promise<void> {
    patchState({ provider, phase: AuthPhase.Authenticating });

    await this.afAuth.auth.signInWithPopup(new this.authProviders[provider]());

    dispatch(new HideLogin());
  }

  @Action(LogoutUser)
  async logoutUser({ patchState }: T): Promise<void> {
    patchState({ provider: undefined, phase: AuthPhase.LoggedOut, user: null });

    await this.afAuth.auth.signOut();
  }

  @Action(UpdateUser)
  updateUser({ patchState }: T, { user }: UpdateUser): void {
    let phase: AuthPhase = AuthPhase.LoggedOut;
    let newUser: IUser | undefined;

    console.log(user);
    if (user) {
      phase = AuthPhase.LoggedIn;
      newUser = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isNewUser: user.metadata.lastSignInTime === user.metadata.creationTime
      };
    }

    patchState({ user: newUser, phase });
  }
}
