import { environment } from '../../environments/environment';

import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';

import { NgxsModule } from '@ngxs/store';
import { AngularFireModule } from 'angularfire2';

import { UiState } from '../shared/states/ui.state';
import { SharedModule } from '../shared/shared.module';
import { UiStateService } from './services/state/ui-state.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthState } from '../shared/states/auth.state';
import { AuthStateService } from './services/state/auth-state.service';
import { UserState } from '../shared/states/user.state';
import { UsersCollectionService } from './services/collection/users-collection.service';
import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    NgxsModule.forRoot([UiState, AuthState, UserState]),
    MatDialogModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  exports: [NgxsModule, AngularFireModule],
  providers: [UiStateService, AuthStateService, UsersCollectionService]
})
export class CoreModule {}
