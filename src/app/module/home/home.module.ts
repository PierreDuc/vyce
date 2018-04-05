import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule, MatDividerModule, MatGridListModule } from '@angular/material';

import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { HomeWelcomeComponent } from './components/home/home-welcome/home-welcome.component';
import { StreamListComponent } from './components/stream-list/stream-list.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    MatGridListModule,
    MatCardModule,
    MatDividerModule
  ],
  declarations: [HomeComponent, HomeWelcomeComponent, StreamListComponent]
})
export class HomeModule {}
