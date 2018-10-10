import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserStateModel } from '../../states/user.state';

@Component({
  selector: 'vc-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  @Input() user?: UserStateModel;
}
