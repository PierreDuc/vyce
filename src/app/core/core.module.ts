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

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    NgxsModule.forRoot([UiState, AuthState]),
    MatDialogModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  exports: [NgxsModule, AngularFireModule],
  providers: [UiStateService, AuthStateService]
})
export class CoreModule {}
