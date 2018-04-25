import { Store } from '@ngxs/store';

import { Injectable } from '@angular/core';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { UserLinkedCollectionService } from './user-linked-collection.service';
import { FirebaseService } from '../../module/firebase/firebase.service';
import {StreamSignalData} from "../../../shared/states/stream.state";

@Injectable()
export class StreamCollectionService extends UserLinkedCollectionService<StreamSignalData> {
  protected readonly dataPath: DataPath = DataPath.Streams;

  constructor(store: Store, fs: FirebaseService) {
    super(store, fs);
  }
}
