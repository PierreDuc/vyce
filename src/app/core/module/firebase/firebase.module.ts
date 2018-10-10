import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { NgModule, NgZone } from '@angular/core';

import { FirebaseService } from './firebase.service';
import { environment } from '../../../../environments/environment';

export function firebaseAppFactory(ngZone: NgZone): FirebaseService {
  const fs: FirebaseService = ngZone.runOutsideAngular(() => firebase.initializeApp(environment.firebase));

  firebase.firestore().settings({
    timestampsInSnapshots: true
  });

  return fs;
}

@NgModule({
  providers: [
    {
      provide: FirebaseService,
      useFactory: firebaseAppFactory,
      deps: [NgZone]
    }
  ]
})
export class FirebaseModule {}
