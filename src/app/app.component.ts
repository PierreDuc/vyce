import { Component } from '@angular/core';
import { UiStateService } from './core/services/state/ui-state.service';

@Component({
  selector: 'vc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(readonly uiSs: UiStateService) {
    console.log(uiSs);
  }
}
