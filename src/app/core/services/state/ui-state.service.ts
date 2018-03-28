import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { takeUntil } from 'rxjs/operators';

import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { Select, Store } from '@ngxs/store';

import { HideLogin, ToggleLogin } from '../../../shared/actions/ui.action';
import { UiState, UiStateModel } from '../../../shared/states/ui.state';
import { LoginDialogComponent } from '../../../shared/components/dialog/login-dialog/login-dialog.component';

@Injectable()
export class UiStateService implements OnDestroy {
  @Select(UiState) uiState$!: Observable<UiStateModel>;

  private destroy: Subject<void> = new Subject<void>();

  private loginDialogRef: MatDialogRef<LoginDialogComponent> | undefined;

  constructor(readonly md: MatDialog, readonly store: Store) {
    this.uiState$.pipe(takeUntil(this.destroy)).subscribe((uiState: UiStateModel) => {
      if (uiState.showLogin && !this.loginDialogRef) {
        this.showLoginDialog();
      } else if (!uiState.showLogin && this.loginDialogRef) {
        this.hideLoginDialog();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

  public toggleLogin(): void {
    this.store.dispatch(new ToggleLogin());
  }

  private showLoginDialog(): void {
    if (this.loginDialogRef) {
      this.loginDialogRef.close();
    }

    this.loginDialogRef = this.md.open(LoginDialogComponent);
    this.loginDialogRef.afterClosed().subscribe(() => this.store.dispatch(new HideLogin()));
  }

  private hideLoginDialog(): void {
    if (this.loginDialogRef) {
      this.loginDialogRef.close();
      this.loginDialogRef = undefined;
    }
  }
}
