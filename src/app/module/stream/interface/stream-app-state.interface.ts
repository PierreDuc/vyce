import { AppState } from '../../../core/interface/app-state.interface';
import { LocalDeviceModel } from '../../../shared/states/devices.state';

export interface StreamAppState extends AppState {
  stream: LocalDeviceModel;
}
