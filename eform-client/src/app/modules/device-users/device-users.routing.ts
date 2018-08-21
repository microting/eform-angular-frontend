import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeviceUsersPageComponent} from './components';

const routes: Routes = [
  {
    path: '',
    component: DeviceUsersPageComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceUsersRouting {
}
