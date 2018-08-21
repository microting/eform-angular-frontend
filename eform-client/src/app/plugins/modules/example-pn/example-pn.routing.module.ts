import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from 'src/app/common/guards';
import {ExamplePnPageComponent} from './components';

export const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: ExamplePnPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamplePnRoutingModule {
}
