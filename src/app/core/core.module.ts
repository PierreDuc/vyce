import { NgModule } from '@angular/core';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxsModule } from '@ngxs/store';

import { UiState } from '../shared/states/ui.state';
import { AuthState } from '../shared/states/auth.state';
import { UserState } from '../shared/states/user.state';
import { DevicesState } from '../shared/states/devices.state';
import { SharedModule } from '../shared/shared.module';

import { FirebaseModule } from './module/firebase/firebase.module';

import { DevicesCollectionService } from './services/collection/devices-collection.service';
import { StreamCollectionService } from './services/collection/stream-collection.service';
import { UsersCollectionService } from './services/collection/users-collection.service';

import { UiStateService } from './services/state/ui-state.service';
import { AuthStateService } from './services/state/auth-state.service';
import { MediaDevicesService } from './services/media-devices.service';
import { IndexDbUserService } from './services/index-db-user.service';
import { StreamConnectionService } from './services/stream-connection.service';
import { StreamState } from '../shared/states/stream.state';
import { StreamConnectorService } from './services/connectors/stream-connector.service';
import { RtcPeerConnectorService } from './services/connectors/rtc-peer-connector.service';
import { StreamStateService } from './services/state/stream-state.service';

import { AuthGuard } from './guards/auth.guard';

@NgModule({
  imports: [
    FirebaseModule,
    NgxsModule.forRoot([UiState, AuthState, UserState, DevicesState, StreamState]),
    MatSnackBarModule,
    MatDialogModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  exports: [
    NgxsModule
  ],
  providers: [
    UiStateService,
    AuthStateService,
    UsersCollectionService,
    DevicesCollectionService,
    StreamCollectionService,
    MediaDevicesService,
    StreamConnectionService,
    IndexDbUserService,
    AuthGuard,
    StreamStateService,
    { provide: StreamConnectorService, useClass: RtcPeerConnectorService, multi: true }
  ]
})
export class CoreModule {}
