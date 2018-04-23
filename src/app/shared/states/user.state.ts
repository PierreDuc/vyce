import { Action, Selector, State, StateContext } from '@ngxs/store';

import { AuthPhase } from '../enums/auth-phase.enum';

import { UsersCollectionService } from '../../core/services/collection/users-collection.service';

import { HideLogin, ShowSnackbar } from '../actions/ui.action';
import { SetPhase } from '../actions/auth.action';
import { ClearDevices, ListDevices } from '../actions/devices.action';
import { LogoutUser, LoginUser } from '../actions/user.action';

export interface UserStateModel {
  uid?: string | null;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isNewUser?: boolean;
  emailVerified?: boolean;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    uid: null
  }
})
export class UserState<T extends StateContext<UserStateModel>> {
  constructor(private readonly us: UsersCollectionService) {}

  @Selector()
  static uid(state: UserStateModel): string | null {
    return state.uid || null;
  }

  @Action(LogoutUser)
  logoutUser({ dispatch, setState, getState }: T): void {
    if (getState().uid) {
      dispatch(new ShowSnackbar(`You've been logged out`));
    }

    setState({ uid: null });

    dispatch([new SetPhase(AuthPhase.LoggedOut), new ClearDevices()]);
  }

  @Action(LoginUser)
  async loginUser({ setState, dispatch }: T, { user }: LoginUser): Promise<void> {
    const loginUser: UserStateModel = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    if (loginUser.uid) {
      const userDoc = await this.us.getDoc(loginUser.uid);

      if (!userDoc.get('emailVerified')) {
        await this.us.set({ emailVerified: true }, loginUser.uid);

        loginUser.isNewUser = true;
      }
    }

    setState(loginUser);
    dispatch([
      new HideLogin(),
      new SetPhase(AuthPhase.LoggedIn),
      new ListDevices(),
      new ShowSnackbar({ message: `Successfully logged in as ${loginUser.displayName}` })
    ]);
  }
}
