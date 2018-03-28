import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { AppLoadService } from './services/app-load.service';

export function initAuth(al: AppLoadService): () => Promise<void> {
  return () => al.initAuth();
}

@NgModule({
  imports: [CoreModule],
  providers: [
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AppLoadService],
      multi: true
    }
  ]
})
export class LoadModule {}
