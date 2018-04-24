import { AuthStateModel } from '../../shared/states/auth.state';
import { DeviceStateModel } from '../../shared/states/devices.state';
import { UiStateModel } from '../../shared/states/ui.state';
import { UserStateModel } from '../../shared/states/user.state';

export interface AppState {
  auth: AuthStateModel;
  devices: DeviceStateModel;
  ui: UiStateModel;
  user: UserStateModel;
}
