import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule
} from '@angular/material';

import { SafeStylePipe } from './pipes/safe-style.pipe';

import { LogoComponent } from './components/logo/logo.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { LoginDialogComponent } from './components/dialog/login-dialog/login-dialog.component';
import { AddDeviceDialogComponent } from './components/dialog/add-device-dialog/add-device-dialog.component';
import { StreamViewComponent } from './components/stream-view/stream-view.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  declarations: [
    SafeStylePipe,
    AvatarComponent,
    LogoComponent,
    LoginDialogComponent,
    AddDeviceDialogComponent,
    StreamViewComponent
  ],
  exports: [CommonModule, FlexLayoutModule, SafeStylePipe, AvatarComponent, LogoComponent],
  entryComponents: [LoginDialogComponent, AddDeviceDialogComponent, StreamViewComponent]
})
export class SharedModule {}
