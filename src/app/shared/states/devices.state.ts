import { Action, State, StateContext } from '@ngxs/store';

import { DevicesCollectionService } from '../../core/services/collection/devices-collection.service';
import {AddLocalDevice, ClearDevices, ListDevices, RemoveLocalDevice} from '../actions/devices.action';
import { MediaDevicesService } from '../../core/services/media-devices.service';
import {ShowSnackbar} from "../actions/ui.action";

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

  @Action(AddLocalDevice)
  async addLocalDevice({dispatch}: T, { device: { audio, video, name } }: AddLocalDevice): Promise<void> {
    const device: DeviceStateModel = {
      name: name,
      audio: this.createInputDevice(audio),
      video: this.createInputDevice(video)
    };

    const doc = await this.dc.add(device);
    await this.md.storeLocalDevice(doc.id, device);

    dispatch(new ShowSnackbar({message: 'Local device added', action: 'undo'})).subscribe(() => {
      dispatch(new RemoveLocalDevice(doc.id));
    });
  }

  @Action(RemoveLocalDevice)
  removeLocalDevice({dispatch}: T, { deviceId }: RemoveLocalDevice): Promise<any> {
    return Promise.all([
      this.dc.delete(deviceId),
      this.md.removeLocalDevice(deviceId)
    ]);
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
