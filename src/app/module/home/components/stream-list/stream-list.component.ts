import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { AuthState } from '../../../../shared/states/auth.state';
import { ShowLogin } from '../../../../shared/actions/ui.action';
import { LocalDeviceState } from '../../../../shared/enums/local-device-state.enum';
import { DevicesState, LocalDeviceModel } from '../../../../shared/states/devices.state';

import { MediaDevicesService } from '../../../../core/services/media-devices.service';
import { DocumentTypedSnapshot } from '../../../../core/interface/document-data.interface';

@Component({
  selector: 'vc-stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamListComponent {
  @Select(DevicesState.devices) readonly devices$!: Observable<DocumentTypedSnapshot<LocalDeviceModel>[]>;
  @Select(DevicesState.localDeviceState) readonly localState$!: Observable<LocalDeviceState>;

  readonly canAddCurrent$: Observable<boolean>;

  constructor(private readonly md: MediaDevicesService, private readonly store: Store) {
    this.canAddCurrent$ = this.localState$.pipe(map(state => state === LocalDeviceState.NotLinked));
  }

  onAddCurrentClick(): void {
    if (this.store.selectSnapshot(AuthState.loggedIn)) {
      this.md.addLocalAvailable();
    } else {
      this.store.dispatch(new ShowLogin());
    }
  }

  onAddStreamClick(): void {
    if (this.store.selectSnapshot(AuthState.loggedIn)) {
      // todo: add stream from URl
    } else {
      this.store.dispatch(new ShowLogin());
    }
  }
}
