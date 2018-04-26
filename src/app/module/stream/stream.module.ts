import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { StreamComponent } from './components/stream/stream.component';
import { StreamResolve } from './resolvers/stream-resolve.service';
import { MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: StreamComponent, resolve: { stream: StreamResolve } }]),
    MatCardModule
  ],
  providers: [StreamResolve],
  declarations: [StreamComponent]
})
export class StreamModule {}
