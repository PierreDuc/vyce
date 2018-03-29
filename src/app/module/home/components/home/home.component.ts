import { Observable } from 'rxjs/Observable';

import { Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { ToggleLogin } from '../../../../shared/actions/ui.action';
import { UserState, UserStateModel } from '../../../../shared/states/user.state';
import { AuthState } from '../../../../shared/states/auth.state';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Select(UserState) readonly user$!: Observable<UserStateModel | null>;
  @Select(AuthState.loggedIn) readonly loggedIn$!: Observable<boolean>;

  constructor(readonly store: Store) {}

  onContinueClick(): void {
    this.store.dispatch(new ToggleLogin());
  }
}
