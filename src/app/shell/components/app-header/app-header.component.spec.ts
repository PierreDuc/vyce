import {NgxsModule} from "@ngxs/store";

import { AppHeaderComponent } from './app-header.component';

import {initComponent} from "../../../../testing/init-component.function";
import {AuthStateService} from "../../../core/services/state/auth-state.service";
import {MockAuthStateService} from "../../../core/services/state/auth-state.service.mock";


describe('AppHeaderComponent', () => {
  initComponent(AppHeaderComponent, {
    imports: [ NgxsModule.forRoot([]) ],
    providers: [
      { provide: AuthStateService, useClass: MockAuthStateService }
    ]
  });
});
