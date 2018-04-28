import { LocalDeviceModel } from '../states/devices.state';

export class AddLocalDevice {
  static readonly type = '[DEVICES] Add device';

  constructor(readonly device: LocalDeviceModel) {}
}

export class RemoveLocalDevice {
  static readonly type = '[DEVICES] Remove local device';

  constructor(readonly deviceId: string) {}
}

export class RemoveDevice {
  static readonly type = '[DEVICES] Remove device';

  constructor(readonly deviceId: string) {}
}

export class ListDevices {
  static readonly type = '[DEVICES] Get devices from user';
}

export class ClearDevices {
  static readonly type = '[DEVICES] Clear devices from user';
}

export class CheckLocalDevice {
  static readonly type = '[DEVICES] Check local device with user device';
}
