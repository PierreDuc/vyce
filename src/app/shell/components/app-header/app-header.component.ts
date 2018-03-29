import { Observable } from 'rxjs/Observable';

import { Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { UiStateService } from '../../../core/services/state/ui-state.service';
import { AuthStateService } from '../../../core/services/state/auth-state.service';
import { UserState, UserStateModel } from '../../../shared/states/user.state';
import { AuthState } from '../../../shared/states/auth.state';

@Component({
  selector: 'vc-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  @Select(UserState) readonly user$!: Observable<UserStateModel | null>;

  constructor(readonly us: UiStateService, readonly as: AuthStateService, readonly store: Store) {}

  onAvatarClick(): void {
    this.store.selectOnce(AuthState.loggedIn).subscribe(loggedIn => {
      loggedIn ? this.as.logoutUser() : this.us.toggleLogin();
    });
  }
}
