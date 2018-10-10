import { LogoComponent } from './logo.component';
import {initComponent} from "../../../../testing/init-component.function";
import {SafeStylePipe} from "../../pipes/safe-style.pipe";

describe('LogoComponent', () => {
  initComponent(LogoComponent, {
    declarations: [
      SafeStylePipe
    ]
  });
});
