import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';

export const routes: Routes = [
  // INSERT ROUTES HERE
  {
    path: 'my-microting-pn',
    loadChildren: () => import('./modules/my-microting-pn/my-microting-pn.module')
      .then(m => m.MyMicrotingPnModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginsRouting {}
