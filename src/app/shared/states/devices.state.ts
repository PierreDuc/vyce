import { Action, Selector, State, StateContext } from '@ngxs/store';

import { DevicesCollectionService } from '../../core/services/collection/devices-collection.service';
import {
  AddLocalDevice,
  CheckLocalDevice,
  ClearDevices,
  ListDevices,
  RemoveLocalDevice
} from '../actions/devices.action';
import { MediaDevicesService } from '../../core/services/media-devices.service';
import { ShowAddDevice, ShowSnackbar } from '../actions/ui.action';
import { LocalDeviceState } from '../enums/local-device-state.enum';

export interface DeviceInputModel {
  deviceId: string;
  kind: MediaDeviceKind;
  label: string;
}

export interface LocalDeviceModel {
  name: string;
  audio: DeviceInputModel | false;
  video: DeviceInputModel | false;
}

export interface DeviceStateModel {
  devices: LocalDeviceModel[];
  localDevices: string[];
  localDeviceState: LocalDeviceState;
}

@State<DeviceStateModel>({
  name: 'devices',
  defaults: {
    devices: [],
    localDevices: [],
    localDeviceState: LocalDeviceState.NotLinked
  }
})
export class DevicesState<T extends StateContext<DeviceStateModel>> {
  constructor(private readonly dc: DevicesCollectionService, private readonly md: MediaDevicesService) {}

  @Selector()
  static devices(state: DeviceStateModel): LocalDeviceModel[] {
    return state.devices;
  }

  @Selector()
  static localDeviceState(state: DeviceStateModel): LocalDeviceState {
    return state.localDeviceState;
  }

  @Action(CheckLocalDevice)
  async checkLocalDevice({ dispatch, patchState, getState }: T): Promise<void> {
    const localDevices = await this.md.getLocalDevices();
    const docs = await Promise.all(localDevices.map(deviceId => this.dc.getDoc(deviceId)));
    const missingDoc = docs.findIndex(doc => !doc.exists);

    if (missingDoc > -1) {
      if (getState().localDeviceState !== LocalDeviceState.LocalNotSaved) {
        patchState({ localDeviceState: LocalDeviceState.LocalNotSaved });
        dispatch(new ShowAddDevice({ deviceId: localDevices[missingDoc] }));
      }

      return;
    }

    const localDeviceIds: string[][] = await Promise.all(
      localDevices.map(localDevice => this.md.getLocalDevice(localDevice) as Promise<string[]>)
    );

    const missingDevice = docs.findIndex((doc, index) => {
      const device = doc.data() as LocalDeviceModel;

      if (device.audio && !localDeviceIds[index].includes(device.audio.deviceId)) {
        return false;
      }

      return !device.video || localDeviceIds[index].includes(device.video.deviceId);
    });

    if (missingDevice > -1) {
      if (getState().localDeviceState !== LocalDeviceState.LocalNotFound) {
        patchState({ localDeviceState: LocalDeviceState.LocalNotFound });
        dispatch(new ShowAddDevice({ device: docs[missingDevice] }));
      }

      return;
    }

    if (docs.length > 0) {
      patchState({ localDeviceState: LocalDeviceState.Linked });
    } else {
      patchState({ localDeviceState: LocalDeviceState.NotLinked });
    }
  }

  @Action(ClearDevices)
  clearDevices({ patchState }: T): void {
    patchState({ devices: [], localDevices: [], localDeviceState: LocalDeviceState.NotLinked });
  }

  @Action(ListDevices)
  listDevices({ patchState, dispatch }: T): void {
    this.dc.getDocs$().subscribe(devices => {
      patchState({ devices });
      dispatch(new CheckLocalDevice());
    });
  }

  @Action(AddLocalDevice)
  async addLocalDevice({ dispatch }: T, { device: { audio, video, name } }: AddLocalDevice): Promise<void> {
    const device: LocalDeviceModel = {
      name: name,
      audio: this.createInputDevice(audio),
      video: this.createInputDevice(video)
    };

    const doc = await this.dc.add(device);
    await this.md.storeLocalDevice(doc.id, device);

    dispatch(new ShowSnackbar({ message: 'Local device added', action: 'undo' })).subscribe(() => {
      dispatch(new RemoveLocalDevice(doc.id));
    });
  }

  @Action(RemoveLocalDevice)
  removeLocalDevice({ dispatch }: T, { deviceId }: RemoveLocalDevice): Promise<void> {
    console.log('RemoveLocalDevice', deviceId);
    return this.md.removeLocalDevice(deviceId).then(() => this.dc.delete(deviceId));
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
