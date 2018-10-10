import {NgxsModule} from "@ngxs/store";

import { HomeWelcomeComponent } from './home-welcome.component';
import { initComponent } from "../../../../../../testing/init-component.function";

describe('HomeWelcomeComponent', () => {
  initComponent(HomeWelcomeComponent, {
    imports: [
      NgxsModule.forRoot([]),
    ]
  });
});
