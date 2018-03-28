import { Action, State, StateContext } from '@ngxs/store';

import { HideLogin, ShowLogin, ToggleLogin } from '../actions/ui.action';

export interface UiStateModel {
  showRegister: boolean;
  showLogin: boolean;
}

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    showRegister: false,
    showLogin: false
  }
})
export class UiState<T extends StateContext<UiStateModel>> {
  @Action(ShowLogin)
  showLogin({ patchState }: T): void {
    patchState({
      showLogin: true
    });
  }

  @Action(HideLogin)
  hideLogin({ patchState }: T): void {
    patchState({
      showLogin: false
    });
  }

  @Action(ToggleLogin)
  toggleLogin({ patchState, getState }: T): void {
    patchState({
      showLogin: !getState().showLogin
    });
  }
}
