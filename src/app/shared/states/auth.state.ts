import { Action, State, StateContext } from '@ngxs/store';

import { User } from '../interface/user.interface';
import { LoginWithProvider } from '../actions/auth.action';
import { LoginProvider } from '../enums/login-provider.enum';
import { AngularFireAuth } from 'angularfire2/auth';

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
  constructor(readonly auth: AngularFireAuth) {}

  @Action(LoginWithProvider)
  loginWithProvider(
    { patchState }: StateContext<AuthStateModel>,
    { provider }: LoginWithProvider
  ): void {
    patchState({
      provider
    });
  }
}
