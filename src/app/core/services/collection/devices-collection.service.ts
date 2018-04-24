import { Store } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { LocalDeviceModel } from '../../../shared/states/devices.state';
import { UserLinkedCollectionService } from './user-linked-collection.service';
import { FirebaseService } from '../../module/firebase/firebase.service';

@Injectable()
export class DevicesCollectionService extends UserLinkedCollectionService<LocalDeviceModel> {
  protected readonly dataPath: DataPath = DataPath.Devices;

  constructor(store: Store, fs: FirebaseService) {
    super(store, fs);
  }
}
