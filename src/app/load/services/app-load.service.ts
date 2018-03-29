import { first } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Actions, ofAction } from '@ngxs/store';

import { AuthStateService } from '../../core/services/state/auth-state.service';
import { SetPhase } from '../../shared/actions/auth.action';

@Injectable()
export class AppLoadService {
  constructor(readonly as: AuthStateService, readonly actions$: Actions) {}

  async initAuth(): Promise<void> {
    await this.as.initAuth();
    await this.actions$.pipe(ofAction(SetPhase), first()).toPromise();
  }
}
