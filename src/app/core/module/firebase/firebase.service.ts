import { app, auth, firestore } from 'firebase';

export abstract class FirebaseService implements Partial<app.App> {
  abstract name: string;
  abstract options: {};
  abstract auth: () => auth.Auth;
  abstract firestore: () => firestore.Firestore;

  static timestamp(): number {
    return firestore.Timestamp.now().toMillis();
  }
}
