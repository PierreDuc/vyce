import { Subject } from 'rxjs/Subject';

import { Injectable, OnDestroy, Type } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Injectable()
export class UiStateService implements OnDestroy {
  private destroy: Subject<void> = new Subject<void>();

  constructor(private readonly md: MatDialog) {}

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public showDialog<T>(dialog: Type<T>): MatDialogRef<T> {
    return this.md.open(dialog);
  }
}
