import { LoginDialogComponent } from './login-dialog.component';
import { initComponent } from "../../../../../testing/init-component.function";
import { AuthStateService } from "../../../../core/services/state/auth-state.service";
import { MockAuthStateService } from "../../../../core/services/state/auth-state.service.mock";

describe('LoginDialogComponent', () => {
  initComponent(LoginDialogComponent, {
    providers: [
      { provide: AuthStateService, useClass: MockAuthStateService }
    ]
  });
});
