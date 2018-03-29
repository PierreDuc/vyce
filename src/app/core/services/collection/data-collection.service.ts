import { DocumentSnapshot } from '@firebase/firestore-types';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { AngularFirestore } from 'angularfire2/firestore';
import { IData } from '../../../shared/interface/data.interface';

export abstract class DataCollectionService<T extends IData> {
  abstract readonly dataPath: DataPath;

  protected constructor(readonly af: AngularFirestore) {}

  async set(data: Partial<T>): Promise<void> {
    if (data.id != null) {
      return this.af.doc(`/${this.dataPath}/${data.id}`).set(data);
    }
  }

  async update(data: Partial<T>): Promise<void> {
    if (data.id != null) {
      return this.af.doc(`/${this.dataPath}/${data.id}`).update(data);
    }
  }

  async get(id: string): Promise<DocumentSnapshot> {
    return this.af.doc(`/${this.dataPath}/${id}`).ref.get();
  }
}
