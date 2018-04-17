import { DeviceStateModel } from '../states/devices.state';

export interface DeviceGroup {
  audio?: DeviceStateModel;
  video?: DeviceStateModel;
}
