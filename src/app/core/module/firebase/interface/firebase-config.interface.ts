import { InjectionToken } from '@angular/core';

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  projectId?: string;
}

export const FirebaseConfig = new InjectionToken<FirebaseConfig>('FirebaseConfigToken');
