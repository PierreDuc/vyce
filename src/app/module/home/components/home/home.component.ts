import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { AuthState } from '../../../../shared/states/auth.state';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @Select(AuthState.loggedIn) readonly loggedIn$!: Observable<boolean>;
}
