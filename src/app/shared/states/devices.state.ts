import { Action, State, StateContext } from '@ngxs/store';

import { DevicesCollectionService } from '../../core/services/collection/devices-collection.service';
import { AddDevice, ClearDevices, ListDevices } from '../actions/devices.action';
import { MediaDevicesService } from '../../core/services/media-devices.service';

export interface DeviceInputModel {
  deviceId: string;
  kind: MediaDeviceKind;
  label: string;
}

export interface DeviceStateModel {
  audio: DeviceInputModel | false;
  video: DeviceInputModel | false;
}

@State<DeviceStateModel[]>({
  name: 'devices',
  defaults: []
})
export class DevicesState<T extends StateContext<DeviceStateModel[]>> {
  constructor(private readonly dc: DevicesCollectionService) {}

  @Action(ClearDevices)
  clearDevices({ setState }: T): void {
    setState([]);
  }

  @Action(ListDevices)
  listDevices({ setState }: T): void {
    this.dc.getDocs$().subscribe(docs => {
      setState(docs);
    });
  }

  @Action(AddDevice)
  addDevice(ctx: T, { device }: AddDevice): Promise<any> {
    return this.dc.add({
      audio: this.createInputDevice(device.audio),
      video: this.createInputDevice(device.video)
    });
  }

  private createInputDevice(device: DeviceInputModel | false): DeviceInputModel | false {
    return (
      device && {
        deviceId: device.deviceId,
        label: device.label,
        kind: device.kind
      }
    );
  }
}
