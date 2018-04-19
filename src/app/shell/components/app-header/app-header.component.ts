import { Observable } from 'rxjs/Observable';

import { Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { AuthStateService } from '../../../core/services/state/auth-state.service';
import { UserState, UserStateModel } from '../../../shared/states/user.state';
import { AuthState } from '../../../shared/states/auth.state';
import { ShowLogin } from '../../../shared/actions/ui.action';
import {LogoutUser} from "../../../shared/actions/user.action";
import {FirebaseService} from "../../../core/module/firebase.service";

@Component({
  selector: 'vc-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {
  @Select(UserState) readonly user$!: Observable<UserStateModel | null>;
  @Select(AuthState.loggedIn) readonly loggedIn$!: Observable<boolean>;

  constructor(private readonly as: AuthStateService, private readonly store: Store) {}

  onAvatarClick(): void {
    if (this.store.selectSnapshot(AuthState.loggedIn)) {
      this.as.logout();
    } else {
      this.store.dispatch(new ShowLogin());
    }
  }
}
