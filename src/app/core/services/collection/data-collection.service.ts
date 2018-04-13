import { DocumentSnapshot, DocumentReference } from '@firebase/firestore-types';

import { DataPath } from '../../../shared/enums/data-path.enum';
import { IData } from '../../../shared/interface/data.interface';
import { FirebaseService } from '../../module/firebase.service';

export abstract class DataCollectionService<T extends IData> {
  abstract dataPath: DataPath;

  protected constructor(readonly fs: FirebaseService) {}

  async set(data: Partial<T>): Promise<void> {
    if (data.id != null) {
      return this.doc(`/${this.dataPath}/${data.id}`).set(data);
    }
  }

  async update(data: Partial<T>): Promise<void> {
    if (data.id != null) {
      return this.doc(`/${this.dataPath}/${data.id}`).update(data);
    }
  }

  get(id: string): Promise<DocumentSnapshot> {
    return this.doc(`/${this.dataPath}/${id}`).get();
  }

  private doc(path: string): DocumentReference {
    return this.fs.firestore().doc(path);
  }
}
