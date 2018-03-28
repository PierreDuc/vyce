import { Component, OnInit } from '@angular/core';
import { AuthState } from '../../../../shared/states/auth.state';
import { IUser } from '../../../../shared/interface/user.interface';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Select(AuthState.user) readonly user$!: Observable<IUser | null>;

  constructor() {}

  ngOnInit() {}
}
