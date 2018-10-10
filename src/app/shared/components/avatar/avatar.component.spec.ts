import { AvatarComponent } from './avatar.component';
import {initComponent} from "../../../../testing/init-component.function";
import {SafeStylePipe} from "../../pipes/safe-style.pipe";

describe('AvatarComponent', () => {
  initComponent(AvatarComponent, {
    declarations: [
      SafeStylePipe
    ]
  });
});
