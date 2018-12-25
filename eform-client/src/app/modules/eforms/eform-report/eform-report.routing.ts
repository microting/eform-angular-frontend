import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EformReportPageComponent} from './components';

const routes: Routes = [
  {
    path: '',
    component: EformReportPageComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EformReportRouting {
}
