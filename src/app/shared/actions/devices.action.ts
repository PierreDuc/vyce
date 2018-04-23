import { LocalDeviceModel } from '../states/devices.state';

export class AddLocalDevice {
  static readonly type = '[DEVICES] Add device';

  constructor(readonly device: LocalDeviceModel) {}
}

export class RemoveLocalDevice {
  static readonly type = '[DEVICES] Remove local device';

  constructor(readonly deviceId: string) {}
}

export class ListDevices {
  static readonly type = '[DEVICES] Get devices from user';
}

export class ClearDevices {
  static readonly type = '[DEVICES] Clear devices from user';
}
