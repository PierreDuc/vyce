import { Component, Input } from '@angular/core';
import { IUser } from '../../interface/user.interface';

@Component({
  selector: 'vc-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() user: IUser | null = null;
}
