import { Type } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Action, State, StateContext } from '@ngxs/store';

import { HideAddDevice, HideLogin, ShowAddDevice, ShowLogin, ShowSnackbar } from '../actions/ui.action';
import { UiStateService } from '../../core/services/state/ui-state.service';
import { LoginDialogComponent } from '../components/dialog/login-dialog/login-dialog.component';
import { AddDeviceDialogComponent } from '../components/dialog/add-device-dialog/add-device-dialog.component';
import { Observable } from 'rxjs/index';
import { UiSnackbarConfig } from '../../core/interface/ui-snackbar-config.interface';

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
  readonly dialogs = new Map<keyof UiStateModel['dialogs'], { dialog: Type<any>; ref?: MatDialogRef<any> }>([
    ['login', { dialog: LoginDialogComponent }],
    ['addDevice', { dialog: AddDeviceDialogComponent }]
  ]);

  constructor(private readonly us: UiStateService) {}

  @Action(ShowLogin)
  showLogin(ctx: T): void {
    this.showDialog(ctx, 'login');
  }

  @Action(HideLogin)
  hideLogin(ctx: T): void {
    this.hideDialog(ctx, 'login');
  }

  @Action(ShowAddDevice)
  showAddDevice(ctx: T, { data }: ShowAddDevice): void {
    this.showDialog(ctx, 'addDevice', data);
  }

  @Action(HideAddDevice)
  hideAddDevice(ctx: T): void {
    this.hideDialog(ctx, 'addDevice');
  }

  @Action(ShowSnackbar)
  showSnackbar(ctx: T, { config }: ShowSnackbar): Observable<void> {
    return this.us.showSnackbar(config as UiSnackbarConfig);
  }

  private showDialog(ctx: T, dialog: keyof UiStateModel['dialogs'], data?: object): void {
    const { getState } = ctx;
    const dialogType = this.dialogs.get(dialog);

    if (!getState().dialogs[dialog] && dialogType) {
      dialogType.ref = this.us.showDialog(dialogType.dialog, data);

      dialogType.ref.afterClosed().subscribe(() => {
        this.patchDialogState(ctx, dialog, false);

        delete dialogType.ref;
      });

      this.patchDialogState(ctx, dialog, true);
    }
  }

  private hideDialog({ getState }: T, dialog: keyof UiStateModel['dialogs']): void {
    const dialogType = this.dialogs.get(dialog);

    if (getState().dialogs[dialog] && dialogType && dialogType.ref) {
      dialogType.ref.close();
    }
  }

  private patchDialogState({ patchState, getState }: T, dialog: keyof UiStateModel['dialogs'], set: boolean): void {
    const dialogs: UiStateModel['dialogs'] = getState().dialogs;
    dialogs[dialog] = set;

    patchState({
      dialogs: dialogs
    });
  }
}
