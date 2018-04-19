import { Store } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { DeviceStateModel } from '../../../shared/states/devices.state';
import { UserLinkedCollectionService } from './user-linked-collection.service';
import { FirebaseService } from '../../module/firebase.service';

@Injectable()
export class DevicesCollectionService extends UserLinkedCollectionService<DeviceStateModel> {
  protected readonly dataPath: DataPath = DataPath.Devices;

  constructor(store: Store, fs: FirebaseService) {
    super(store, fs);
  }
}
