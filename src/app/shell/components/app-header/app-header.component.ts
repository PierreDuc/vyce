import { Observable } from 'rxjs/Observable';

import { Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { IUser } from '../../../shared/interface/user.interface';
import { AuthState } from '../../../shared/states/auth.state';
import { UiStateService } from '../../../core/services/state/ui-state.service';
import { AuthStateService } from '../../../core/services/state/auth-state.service';

@Component({
  selector: 'vc-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  @Select(AuthState.user) readonly user$!: Observable<IUser | null>;

  constructor(readonly us: UiStateService, readonly as: AuthStateService, readonly store: Store) {}

  onAvatarClick(): void {
    this.store
      .selectOnce<IUser | null>(AuthState.user)
      .subscribe(user => (user ? this.as.logoutUser() : this.us.toggleLogin()));
  }
}
