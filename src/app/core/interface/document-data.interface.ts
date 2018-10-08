import { DocumentSnapshot, SnapshotOptions } from '@firebase/firestore-types';

export interface DocumentTypedSnapshot<T> extends DocumentSnapshot {
  data(options?: SnapshotOptions): T;
  get(fieldPath: string, options?: SnapshotOptions): T[keyof T];
}
