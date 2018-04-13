import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppShellModule } from './shell/app-shell.module';
import { LoadModule } from './load/load.module';

@NgModule({
  imports: [BrowserModule, LoadModule, AppRoutingModule, AppShellModule],
  declarations: [AppComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
