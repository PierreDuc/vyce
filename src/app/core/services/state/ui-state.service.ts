import { Observable } from 'rxjs/index';

import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { UiSnackbarConfig } from '../../interface/ui-snackbar-config.interface';

@Injectable()
export class UiStateService {
  private readonly snackbarConfig: MatSnackBarConfig = {
    duration: 2500
  };

  constructor(private readonly md: MatDialog, private readonly sb: MatSnackBar) {}

  public showDialog<T>(dialog: Type<T>, data?: any): MatDialogRef<T> {
    return this.md.open(dialog, { data });
  }

  public showSnackbar({ message, action, config }: UiSnackbarConfig): Observable<void> {
    config = config || {};

    if (action && !config.duration) {
      config.duration = 5000;
    }

    return this.sb.open(message, action, { ...this.snackbarConfig, ...config }).onAction();
  }
}
