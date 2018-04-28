import { Component, Input } from '@angular/core';

import { Store } from '@ngxs/store';

import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import { LocalDeviceModel } from '../../../../shared/states/devices.state';
import { DocumentTypedSnapshot } from '../../../../core/interface/document-data.interface';
import { RemoveDevice } from '../../../../shared/actions/devices.action';

@Component({
  selector: 'vc-stream-thumb',
  templateUrl: './stream-thumb.component.html',
  styleUrls: ['./stream-thumb.component.scss']
})
export class StreamThumbComponent {
  @Input() device?: DocumentTypedSnapshot<LocalDeviceModel>;

  constructor(private readonly md: MediaDevicesService, private readonly store: Store) {}

  public onDeleteDevice(): void {
    if (this.device) {
      this.store.dispatch(new RemoveDevice(this.device.id));
    }
  }
}
