import { DataPath } from '../../../shared/enums/data-path.enum';
import { AngularFirestore } from 'angularfire2/firestore';
import { IData } from '../../../shared/interface/data.interface';

export abstract class DataCollectionService<T extends IData> {
  abstract readonly dataPath: DataPath;

  protected constructor(readonly af: AngularFirestore) {}

  async insert(data: T): Promise<void> {
    if (data.id) {
      return this.af
        .collection(`/${this.dataPath}`)
        .doc(data.id)
        .set(data);
    }
  }
}
