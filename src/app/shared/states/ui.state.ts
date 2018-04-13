import { Action, State, StateContext } from '@ngxs/store';

import { HideLogin, ShowLogin, ToggleLogin } from '../actions/ui.action';
import { UiStateService } from '../../core/services/state/ui-state.service';
import { LoginDialogComponent } from '../components/dialog/login-dialog/login-dialog.component';
import { MatDialogRef } from '@angular/material';
import { Type } from '@angular/core';

export interface UiStateModel {
  dialogs: {
    login: boolean;
    addDevice: boolean;
  };
}

@State<UiStateModel>({
  name: 'ui',
  defaults: {
    dialogs: {
      login: false,
      addDevice: false
    }
  }
})
export class UiState<T extends StateContext<UiStateModel>> {
  readonly refs: { [key: string]: MatDialogRef<any> } = {};

  constructor(private readonly us: UiStateService) {}

  @Action(ShowLogin)
  showLogin(ctx: T): void {
    this.showDialog(ctx, 'login', LoginDialogComponent);
  }

  @Action(HideLogin)
  hideLogin(ctx: T): void {
    this.hideDialog(ctx, 'login');
  }

  @Action(ToggleLogin)
  toggleLogin({ dispatch, getState }: T): void {
    getState().dialogs.login ? dispatch(HideLogin) : dispatch(ShowLogin);
  }

  private showDialog(ctx: T, dialog: keyof UiStateModel['dialogs'], type: Type<any>): void {
    const { getState } = ctx;

    if (!getState().dialogs[dialog]) {
      this.refs[dialog] = this.us.showDialog(type);

      this.refs[dialog].afterClosed().subscribe(() => {
        this.patchDialog(ctx, dialog, false);

        delete this.refs[dialog];
      });

      this.patchDialog(ctx, dialog, true);
    }
  }

  private hideDialog({ getState }: T, dialog: keyof UiStateModel['dialogs']): void {
    if (getState().dialogs[dialog] && this.refs[dialog]) {
      this.refs[dialog].close();
    }
  }

  private patchDialog({ patchState, getState }: T, dialog: keyof UiStateModel['dialogs'], set: boolean): void {
    const dialogs: UiStateModel['dialogs'] = getState().dialogs;
    dialogs[dialog] = set;

    patchState({
      dialogs: dialogs
    });
  }
}
