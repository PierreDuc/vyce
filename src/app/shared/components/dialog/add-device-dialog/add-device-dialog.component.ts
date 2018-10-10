import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DocumentSnapshot } from '@firebase/firestore-types';

import { Select, Store } from '@ngxs/store';

import { AddLocalDevice, CheckLocalDevice, RemoveLocalDevice } from '../../../actions/devices.action';
import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import { DevicesState, LocalDeviceModel } from '../../../states/devices.state';
import {DeviceType, DeviceTypes} from '../../../enums/device-type.enum';
import { LocalDeviceState } from '../../../enums/local-device-state.enum';

interface MediaInputType {
  disabled?: boolean;
  selected?: MediaDeviceInfo;
  devices: MediaDeviceInfo[];
}

interface MediaInputs {
  audio: MediaInputType;
  video: MediaInputType;
}

@Component({
  templateUrl: './add-device-dialog.component.html',
  styleUrls: ['./add-device-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDeviceDialogComponent {
  readonly inputs$: Observable<MediaInputs>;

  readonly sources: { prop: keyof MediaInputs; icon: string }[] = [
    { prop: 'audio', icon: 'mic' },
    { prop: 'video', icon: 'videocam' }
  ];

  readonly states = LocalDeviceState;

  @Select(DevicesState.localDeviceState) localDeviceState$!: LocalDeviceState;

  deviceName = '';

  constructor(
    private readonly store: Store,
    private readonly md: MediaDevicesService,
    @Inject(MAT_DIALOG_DATA) private readonly data: { device?: DocumentSnapshot; deviceId?: string } = {}
  ) {
    this.inputs$ = this.md.devices$.pipe(
      map(({ audio, video }) => ({
        audio: this.filterDevices(audio),
        video: this.filterDevices(video)
      }))
    );

    if (this.data.device) {
      this.deviceName = this.data.device.get('name');
    }
  }

  async onAddDeviceClick({ audio, video }: MediaInputs, state: LocalDeviceState): Promise<void> {
    await this.removeLocalDevice(state);

    const device: LocalDeviceModel = {
      name: this.deviceName,
      audio: (!audio.disabled && audio.selected) || false,
      video: (!video.disabled && video.selected) || false
    };

    if (device.audio || device.video) {
      this.store.dispatch(new AddLocalDevice(device));
    }
  }

  onDeleteClick(state: LocalDeviceState): void {
    const deviceId = this.getDeviceId();

    if (deviceId) {
      this.store.dispatch(new RemoveLocalDevice(deviceId)).subscribe(() => {
        if (state === LocalDeviceState.LocalNotSaved) {
          this.store.dispatch(new CheckLocalDevice());
        }
      });
    }
  }

  private async removeLocalDevice(state: LocalDeviceState): Promise<void> {
    const deviceId = this.getDeviceId();

    if (state !== LocalDeviceState.NotLinked && deviceId) {
      return this.md.removeLocalDevice(deviceId);
    }
  }

  private getDeviceId(): string | undefined {
    return this.data.deviceId || (this.data.device && this.data.device.id);
  }

  private filterDevices(devices: MediaDeviceInfo[]): MediaInputType {
    const standard: MediaDeviceInfo | undefined = devices.find(device => device.deviceId === DeviceType.Default);
    const inputType: MediaInputType = {
      selected: (standard && devices.find(i => i.groupId === standard.groupId && !DeviceTypes.includes(i.deviceId))),
      devices: devices.filter(device => !DeviceTypes.includes(device.deviceId))
    };

    if (!inputType.selected) {
      inputType.selected = inputType.devices[0];
    }

    inputType.disabled = inputType.devices.length === 0;

    return inputType;
  }
}
