import { Component, OnInit } from '@angular/core';

import { Store } from '@ngxs/store';

import { LoginProvider } from '../../../enums/login-provider.enum';
import { LoginWithProvider } from '../../../actions/auth.action';
import { AuthStateService } from '../../../../core/services/state/auth-state.service';

@Component({
  selector: 'vc-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  readonly loginProviders: [
    keyof LoginProvider,
    LoginProvider
  ][] = Object.entries(LoginProvider) as [keyof LoginProvider, LoginProvider][];

  constructor(readonly as: AuthStateService) {}

  ngOnInit() {}

  onContinueClick(provider: LoginProvider): void {
    this.as.loginWithProvider(provider);
  }
}
