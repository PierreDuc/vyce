import * as firebase from 'firebase';
import 'firebase/firestore';

import { NgModule } from '@angular/core';

import { FirebaseConfig } from './interface/firebase-config.interface';
import { FirebaseService } from './firebase.service';

export function _firebaseAppFactory(config: FirebaseConfig): FirebaseService {
  const fs: FirebaseService = firebase.initializeApp(config);

  firebase.firestore().settings({
    timestampsInSnapshots: true
  });

  return fs;
}

@NgModule({})
export class FirebaseModule {
  static initialize(config: FirebaseConfig) {
    return {
      ngModule: FirebaseModule,
      providers: [
        {
          provide: FirebaseConfig,
          useValue: config
        },
        {
          provide: FirebaseService,
          useFactory: _firebaseAppFactory,
          deps: [FirebaseConfig]
        }
      ]
    };
  }
}
