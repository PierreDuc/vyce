import { Injectable } from '@angular/core';

import { AuthStateService } from '../../core/services/state/auth-state.service';
import {Actions, ofAction} from "@ngxs/store";
import {UpdateUser} from "../../shared/actions/auth.action";
import {first} from "rxjs/operators";

@Injectable()
export class AppLoadService {
  constructor(readonly as: AuthStateService, readonly actions$: Actions) {}

  async initAuth(): Promise<void> {
    await this.as.initAuth();
    await this.actions$.pipe(ofAction(UpdateUser), first()).toPromise()
  }
}
