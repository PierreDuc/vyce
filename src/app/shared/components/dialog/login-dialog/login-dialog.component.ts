import { Component } from '@angular/core';

import { LoginProvider } from '../../../enums/login-provider.enum';
import { AuthStateService } from '../../../../core/services/state/auth-state.service';

@Component({
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  readonly loginProviders: [keyof LoginProvider, LoginProvider][] = Object.entries(LoginProvider) as [
    keyof LoginProvider,
    LoginProvider
  ][];

  constructor(readonly as: AuthStateService) {}

  onContinueClick(provider: LoginProvider): void {
    this.as.loginWithProvider(provider);
  }
}
