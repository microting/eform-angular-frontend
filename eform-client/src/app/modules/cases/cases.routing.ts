import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CaseEditComponent, CasesTableComponent} from 'src/app/modules/cases/components';

const routes: Routes = [

  {
    path: ':id',
    component: CasesTableComponent,
  },
  {
    path: 'edit/:id/:templateId',
    component: CaseEditComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule {
}
