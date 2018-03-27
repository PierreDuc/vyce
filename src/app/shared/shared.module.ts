import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { LogoComponent } from './components/logo/logo.component';
import { SafeStylePipe } from './pipes/safe-style.pipe';
import { AvatarComponent } from './components/avatar/avatar.component';
import { LoginDialogComponent } from './components/dialog/login-dialog/login-dialog.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MatIconModule, MatButtonModule],
  declarations: [
    SafeStylePipe,

    AvatarComponent,
    LogoComponent,
    LoginDialogComponent
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,

    SafeStylePipe,

    AvatarComponent,
    LogoComponent
  ],
  entryComponents: [LoginDialogComponent]
})
export class SharedModule {}
