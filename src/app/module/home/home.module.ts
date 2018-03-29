import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MatDividerModule, MatGridListModule } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
    MatGridListModule,
    MatDividerModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule {}
