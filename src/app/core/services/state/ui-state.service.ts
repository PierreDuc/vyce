import { Observable } from 'rxjs';

import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { UiSnackbarConfig } from '../../interface/ui-snackbar-config.interface';

@Injectable()
export class UiStateService {
  private readonly snackbarConfig: MatSnackBarConfig = {
    duration: 2500
  };

  constructor(private readonly md: MatDialog, private readonly sb: MatSnackBar) {}

  public showDialog<T, R = null>(dialog: Type<T>, data?: R): MatDialogRef<T, R> {
    return this.md.open<T, R>(dialog, { data });
  }

  public showSnackbar({ message, action, config }: UiSnackbarConfig): Observable<void> {
    config = config || {};

    if (action && !config.duration) {
      config.duration = 5000;
    }

    return this.sb.open(message, action, { ...this.snackbarConfig, ...config }).onAction();
  }
}
