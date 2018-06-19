import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from 'app/guards';
import {VehiclesPnPageComponent, VehiclesPnAddUpdateComponent} from './components';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: VehiclesPnPageComponent
  },
  {
    path: 'add-or-update',
    canActivate: [AuthGuard],
    component: VehiclesPnAddUpdateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesPnRoutingModule {
}
