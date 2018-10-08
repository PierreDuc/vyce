import firebase from 'firebase/app';

export abstract class FirebaseService implements Partial<firebase.app.App> {
  abstract name: string;
  abstract options: {};
  abstract auth: () => firebase.auth.Auth;
  abstract firestore: () => firebase.firestore.Firestore;

  static timestamp(): number {
    return firebase.firestore.Timestamp.now().toMillis();
  }
}
