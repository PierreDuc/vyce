import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Select } from '@ngxs/store';

import { AuthState } from '../../../../shared/states/auth.state';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  @Select(AuthState.loggedIn) readonly loggedIn$!: Observable<boolean>;
}
