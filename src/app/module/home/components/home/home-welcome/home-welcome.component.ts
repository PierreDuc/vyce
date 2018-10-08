import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { ShowLogin } from '../../../../../shared/actions/ui.action';
import { AuthState } from '../../../../../shared/states/auth.state';
import { UserState, UserStateModel } from '../../../../../shared/states/user.state';

@Component({
  selector: 'vc-home-welcome',
  templateUrl: './home-welcome.component.html',
  styleUrls: ['./home-welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeWelcomeComponent {
  @Select(UserState) readonly user$!: Observable<UserStateModel | null>;
  @Select(AuthState.loggedIn) readonly loggedIn$!: Observable<boolean>;

  constructor(private readonly store: Store) {}

  onContinueClick(): void {
    this.store.dispatch(new ShowLogin());
  }
}
