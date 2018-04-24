import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxsModule } from '@ngxs/store';

import { SharedModule } from '../../shared/shared.module';
import { StreamComponent } from './components/stream/stream.component';
import { StreamResolve } from './resolvers/stream-resolve.service';
import { StreamState } from './states/stream.state';
import { MatCardModule } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: StreamComponent, resolve: { stream: StreamResolve } }]),
    NgxsModule.forFeature([StreamState]),
    MatCardModule
  ],
  providers: [StreamResolve],
  declarations: [StreamComponent]
})
export class StreamModule {}
