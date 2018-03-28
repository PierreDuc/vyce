import { Injectable } from '@angular/core';

import { AuthStateService } from '../../core/services/state/auth-state.service';

@Injectable()
export class AppLoadService {
  constructor(readonly as: AuthStateService) {}

  async initAuth(): Promise<void> {
    await this.as.initAuth();
  }
}
