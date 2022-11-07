import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';

export const routes: Routes = [
  // INSERT ROUTES HERE
  {
    path: 'backend-configuration-pn',
    loadChildren: () => import('./modules/backend-configuration-pn/backend-configuration-pn.module')
      .then(m => m.BackendConfigurationPnModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginsRouting {}
