import { Component, HostListener } from '@angular/core';
import { ToggleLogin } from '../../actions/ui.action';
import { Store } from '@ngxs/store';

@Component({
  selector: 'vc-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  constructor(readonly store: Store) {}

  @HostListener('click')
  onClick(): void {
    this.store.dispatch(new ToggleLogin());
  }
}
