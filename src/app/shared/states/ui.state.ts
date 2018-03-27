import { Action, State } from '@ngxs/store';

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
export class UiState {
  @Action(ShowLogin)
  showLogin({ patchState }): void {
    patchState({
      showLogin: true
    });
  }

  @Action(HideLogin)
  hideLogin({ patchState }): void {
    patchState({
      showLogin: false
    });
  }

  @Action(ToggleLogin)
  toggleLogin({ patchState, getState }): void {
    patchState({
      showLogin: !getState().showLogin
    });
  }
}
