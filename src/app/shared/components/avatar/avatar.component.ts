import { Component, Input } from '@angular/core';
import { UserStateModel } from '../../states/user.state';

@Component({
  selector: 'vc-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() user: UserStateModel | null = null;
}
