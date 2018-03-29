import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';

import { DataCollectionService } from './data-collection.service';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { IUser } from '../../../shared/interface/user.interface';

@Injectable()
export class UsersCollectionService extends DataCollectionService<IUser> {
  constructor(readonly af: AngularFirestore) {
    super(af);
  }

  readonly dataPath: DataPath = DataPath.Users;
}
