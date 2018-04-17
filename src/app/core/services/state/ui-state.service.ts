import { Injectable, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Injectable()
export class UiStateService {
  constructor(private readonly md: MatDialog) {}

  public showDialog<T>(dialog: Type<T>): MatDialogRef<T> {
    return this.md.open(dialog);
  }
}
