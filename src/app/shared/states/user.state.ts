import { Action, State, StateContext } from '@ngxs/store';

import { IUser } from '../interface/user.interface';
import { AuthPhase } from '../enums/auth-phase.enum';
import { LogoutUser, UpdateUser } from '../actions/user.action';
import { SetPhase } from '../actions/auth.action';
import { UsersCollectionService } from '../../core/services/collection/users-collection.service';

export interface UserStateModel extends IUser {
  id: string | null;
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
  logoutUser({ dispatch }: T): void {
    dispatch(new UpdateUser(null));
  }

  @Action(UpdateUser)
  async updateUser({ setState, dispatch }: T, { user }: UpdateUser): Promise<void> {
    let phase: AuthPhase = AuthPhase.LoggedOut;
    let newUser: IUser | UserStateModel = { id: null };

    if (user != null) {
      phase = AuthPhase.LoggedIn;
      newUser = {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isNewUser: user.metadata.lastSignInTime === user.metadata.creationTime
      };

      if (newUser.isNewUser && newUser.id) {
        await this.us.insert(newUser);
      }
    }

    setState(newUser);
    dispatch(new SetPhase(phase));
  }
}
