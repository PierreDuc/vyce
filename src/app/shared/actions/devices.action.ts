import { DeviceStateModel } from '../states/devices.state';

export class AddDevice {
  static readonly type = '[DEVICES] Add device';

  constructor(readonly device: DeviceStateModel) {}
}

export class ListDevices {
  static readonly type = '[DEVICES] Get devices from user';
}

export class ClearDevices {
  static readonly type = '[DEVICES] Clear devices from user';
}
