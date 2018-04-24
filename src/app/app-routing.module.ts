import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: 'app/module/home/home.module#HomeModule' },
  {
    path: 'stream/:streamId',
    loadChildren: 'app/module/stream/stream.module#StreamModule',
    canLoad: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
