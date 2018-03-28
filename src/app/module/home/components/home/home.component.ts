import {Observable} from "rxjs/Observable";

import { Component } from '@angular/core';

import {Select, Store} from "@ngxs/store";

import {IUser} from "../../../../shared/interface/user.interface";
import {AuthState} from "../../../../shared/states/auth.state";
import {ToggleLogin} from "../../../../shared/actions/ui.action";

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Select(AuthState.user) readonly user$!: Observable<IUser | null>;

  constructor(readonly store: Store) {}

  onContinueClick(): void {
    this.store.dispatch(new ToggleLogin());
  }
}
