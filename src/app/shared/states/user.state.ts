import { Action, State, StateContext } from '@ngxs/store';

import { AuthPhase } from '../enums/auth-phase.enum';
import { LogoutUser, LoginUser } from '../actions/user.action';
import { SetPhase } from '../actions/auth.action';
import { UsersCollectionService } from '../../core/services/collection/users-collection.service';
import { IData } from '../interface/data.interface';
import { HideLogin } from '../actions/ui.action';

export interface UserStateModel extends IData {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isNewUser?: boolean;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    id: null
  }
})
export class UserState<T extends StateContext<UserStateModel>> {
  constructor(readonly us: UsersCollectionService) {}

  @Action(LogoutUser)
  logoutUser({ dispatch, setState }: T): void {
    setState({ id: null });
    dispatch(new SetPhase(AuthPhase.LoggedOut));
  }

  @Action(LoginUser)
  async loginUser({ setState, dispatch }: T, { user }: LoginUser): Promise<void> {
    const loginUser: UserStateModel = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    if (loginUser.id) {
      if ((await this.us.get(loginUser.id)).get('id') !== loginUser.id) {
        await this.us.set({ id: loginUser.id });

        loginUser.isNewUser = true;
      }
    }

    setState(loginUser);
    dispatch([new HideLogin(), new SetPhase(AuthPhase.LoggedIn)]);
  }
}
