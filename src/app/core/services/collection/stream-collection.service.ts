import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { StreamConnectionData } from '../../../shared/states/stream.state';

import { FirebaseService } from '../../module/firebase/firebase.service';

import { UserLinkedCollectionService } from './user-linked-collection.service';

@Injectable()
export class StreamCollectionService extends UserLinkedCollectionService<StreamConnectionData> {
  protected readonly dataPath: DataPath = DataPath.Streams;

  constructor(store: Store, fs: FirebaseService) {
    super(store, fs);
  }
}
