import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Store } from '@ngxs/store';

import { RemoveDevice } from '../../../../shared/actions/devices.action';
import { LocalDeviceModel } from '../../../../shared/states/devices.state';
import { DocumentTypedSnapshot } from '../../../../core/interface/document-data.interface';
import { StreamConnectionService } from '../../../../core/services/stream-connection.service';

@Component({
  selector: 'vc-stream-thumb',
  templateUrl: './stream-thumb.component.html',
  styleUrls: ['./stream-thumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamThumbComponent {
  @Input() device?: DocumentTypedSnapshot<LocalDeviceModel>;

  constructor(private readonly store: Store, private readonly sc: StreamConnectionService) {}

  public onDeleteDevice(): void {
    if (this.device) {
      this.store.dispatch(new RemoveDevice(this.device.id));
    }
  }

  public onStartStream(): void {
    if (this.device) {
      this.sc.connectToStream(this.device.id);
    }
  }
}
