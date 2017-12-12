import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EFormTableComponent} from './components/eform-page/eform-table.component';

const routes: Routes = [
  {
    path: '',
    component: EFormTableComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EFormRoutingModule {
}
