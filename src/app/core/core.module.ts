import { environment } from '../../environments/environment';

import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';

import { NgxsModule } from '@ngxs/store';

import { UiState } from '../shared/states/ui.state';
import { SharedModule } from '../shared/shared.module';
import { UiStateService } from './services/state/ui-state.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthState } from '../shared/states/auth.state';
import { AuthStateService } from './services/state/auth-state.service';
import { UserState } from '../shared/states/user.state';
import { UsersCollectionService } from './services/collection/users-collection.service';
import { FirebaseModule } from './module/firebase.module';
import { MediaDevicesService } from './services/media-devices.service';
import {DevicesCollectionService} from "./services/collection/devices-collection.service";
import {DevicesState} from "../shared/states/devices.state";

@NgModule({
  imports: [
    FirebaseModule.initialize(environment.firebase),
    NgxsModule.forRoot([UiState, AuthState, UserState, DevicesState]),
    MatDialogModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  exports: [NgxsModule],
  providers: [UiStateService, AuthStateService, UsersCollectionService, DevicesCollectionService, MediaDevicesService]
})
export class CoreModule {}
