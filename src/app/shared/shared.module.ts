import { NgModule } from '@angular/core';
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

import { LogoComponent } from './components/logo/logo.component';
import { SafeStylePipe } from './pipes/safe-style.pipe';
import { AvatarComponent } from './components/avatar/avatar.component';
import { LoginDialogComponent } from './components/dialog/login-dialog/login-dialog.component';
import { AddDeviceDialogComponent } from './components/dialog/add-device-dialog/add-device-dialog.component';
import { FormsModule } from '@angular/forms';

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
  declarations: [SafeStylePipe, AvatarComponent, LogoComponent, LoginDialogComponent, AddDeviceDialogComponent],
  exports: [CommonModule, FlexLayoutModule, SafeStylePipe, AvatarComponent, LogoComponent],
  entryComponents: [LoginDialogComponent, AddDeviceDialogComponent]
})
export class SharedModule {}
