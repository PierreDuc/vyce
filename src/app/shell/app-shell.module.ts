import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';

import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';

@NgModule({
  imports: [MatToolbarModule, SharedModule],
  declarations: [AppHeaderComponent, AppFooterComponent],
  exports: [AppHeaderComponent, AppFooterComponent]
})
export class AppShellModule {}
