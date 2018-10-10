import { first } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { Actions, ofAction } from '@ngxs/store';

import { AuthStateService } from '../../core/services/state/auth-state.service';
import { SetPhase } from '../../shared/actions/auth.action';

@Injectable()
export class AppLoadService {
  constructor(private readonly as: AuthStateService, private readonly actions$: Actions) {}

  initAuth(): Promise<void> {
    return Promise.all([this.as.initAuth(), this.actions$.pipe(ofAction(SetPhase), first()).toPromise()]).then(() => void 0);
  }
}
