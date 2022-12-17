import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from 'src/app/common/guards';
import {AdminSettingsComponent} from './components';


const routes: Routes = [
  {
    // canActivate: [AuthGuard],
    path: '',
    component: AdminSettingsComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationSettingsRouting {
}
