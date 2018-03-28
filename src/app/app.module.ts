import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppShellModule } from './shell/app-shell.module';
import { LoadModule } from './load/load.module';

@NgModule({
  imports: [
    BrowserModule,
    LoadModule,

    AngularFireAuthModule,
    AngularFireStorageModule,

    AppRoutingModule,
    AppShellModule
  ],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
