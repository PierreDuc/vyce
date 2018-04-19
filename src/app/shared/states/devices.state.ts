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
  name: string;
  audio: DeviceInputModel | false;
  video: DeviceInputModel | false;
}

@State<DeviceStateModel[]>({
  name: 'devices',
  defaults: []
})
export class DevicesState<T extends StateContext<DeviceStateModel[]>> {
  constructor(private readonly dc: DevicesCollectionService, private readonly md: MediaDevicesService) {}

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
  addDevice(ctx: T, { device: { audio, video, name } }: AddDevice): Promise<void> {
    const device: DeviceStateModel = {
      name: name,
      audio: this.createInputDevice(audio),
      video: this.createInputDevice(video)
    };

    return this.dc.add(device).then(doc => {
      return this.md.storeLocalDevice(doc.id, device);
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
