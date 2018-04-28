import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule, MatTooltipModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';

import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';

@NgModule({
  imports: [MatToolbarModule, MatTooltipModule, SharedModule, RouterModule],
  declarations: [AppHeaderComponent, AppFooterComponent],
  exports: [AppHeaderComponent, AppFooterComponent]
})
export class AppShellModule {}
