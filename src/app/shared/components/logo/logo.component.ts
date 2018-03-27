import { Component, Input } from '@angular/core';

import { LogoSize } from '../../enums/logo-size.enum';

@Component({
  selector: 'vc-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  @Input() size: LogoSize = LogoSize.X1;

  @Input() showName: boolean = false;
}
