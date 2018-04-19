import { environment } from '../../environments/environment';

import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxsModule } from '@ngxs/store';

import { UiState } from '../shared/states/ui.state';
import { AuthState } from '../shared/states/auth.state';
import { UserState } from '../shared/states/user.state';
import { DevicesState } from '../shared/states/devices.state';
import { SharedModule } from '../shared/shared.module';

import { FirebaseModule } from './module/firebase.module';

import { UiStateService } from './services/state/ui-state.service';
import { AuthStateService } from './services/state/auth-state.service';
import { MediaDevicesService } from './services/media-devices.service';
import { UsersCollectionService } from './services/collection/users-collection.service';
import { DevicesCollectionService } from './services/collection/devices-collection.service';
import { IndexDbUserService } from './services/index-db-user.service';

@NgModule({
  imports: [
    FirebaseModule.initialize(environment.firebase),
    NgxsModule.forRoot([UiState, AuthState, UserState, DevicesState]),
    MatDialogModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  exports: [NgxsModule],
  providers: [
    UiStateService,
    AuthStateService,
    UsersCollectionService,
    DevicesCollectionService,
    MediaDevicesService,
    IndexDbUserService
  ]
})
export class CoreModule {}
