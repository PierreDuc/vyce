import {Action, Selector, State, StateContext} from '@ngxs/store';

import { AuthPhase } from '../enums/auth-phase.enum';
import { LogoutUser, LoginUser} from '../actions/user.action';
import { SetPhase } from '../actions/auth.action';
import { UsersCollectionService } from '../../core/services/collection/users-collection.service';
import { HideLogin } from '../actions/ui.action';

export interface UserStateModel {
  uid?: string | null;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isNewUser?: boolean;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    uid: null
  }
})
export class UserState<T extends StateContext<UserStateModel>> {
  constructor(readonly us: UsersCollectionService) {}

  @Selector()

  @Action(LogoutUser)
  logoutUser({ dispatch, setState }: T): void {
    setState({ uid: null });
    dispatch(new SetPhase(AuthPhase.LoggedOut));
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
      if ((await this.us.get(loginUser.uid)).get('uid') !== loginUser.uid) {
        await this.us.set({ uid: loginUser.uid }, loginUser.uid);

        loginUser.isNewUser = true;
      }
    }

    setState(loginUser);
    dispatch([new HideLogin(), new SetPhase(AuthPhase.LoggedIn)]);
  }
}
