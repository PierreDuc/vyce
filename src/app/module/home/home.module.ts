import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatGridListModule,
  MatIconModule,
  MatMenuModule
} from '@angular/material';

import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { HomeWelcomeComponent } from './components/home/home-welcome/home-welcome.component';
import { StreamListComponent } from './components/stream-list/stream-list.component';
import { StreamThumbComponent } from './components/stream-thumb/stream-thumb.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    MatGridListModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  declarations: [HomeComponent, HomeWelcomeComponent, StreamListComponent, StreamThumbComponent]
})
export class HomeModule {}
