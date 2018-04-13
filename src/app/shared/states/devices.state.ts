import {Action, State, StateContext} from '@ngxs/store';

import {DevicesCollectionService} from "../../core/services/collection/devices-collection.service";
import {AddDevice} from "../actions/devices.action";

export interface DeviceStateModel {
  deviceId: string;
  kind: MediaDeviceKind;
  label: string;
  groupId: string;
}

@State<DeviceStateModel[]>({
  name: 'devices',
  defaults: []
})
export class DevicesState<T extends StateContext<DeviceStateModel[]>> {
  constructor(readonly dc: DevicesCollectionService) {}

  @Action(AddDevice)
  async addDevice({ setState }: T, { devices }: AddDevice): Promise<void> {
    const groupId: string = this.dc.createPushId();

    await Promise.all(devices.map(device => this.dc.add({
      deviceId: device.deviceId,
      kind: device.kind,
      label: device.label,
      groupId
    })));
  }
}
