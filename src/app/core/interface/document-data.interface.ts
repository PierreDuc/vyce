import { DocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types';

export interface DocumentTypedSnapshot<T> extends DocumentSnapshot {
  data(options?: SnapshotOptions): T;
  get(fieldPath: keyof T, options?: SnapshotOptions): any;
}
