export class AddDevice {
  static type = '[DEVICES] Add device';

  constructor(readonly devices: MediaDeviceInfo[]) {
  }
}
