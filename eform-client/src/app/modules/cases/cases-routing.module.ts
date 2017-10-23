import {CasesEditComponent} from './components/cases-edit/cases-edit.component';
import {CasesTableComponent} from './components/cases-table/cases-table.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CasesComponent} from './components/cases.component';

const routes: Routes = [
  {
    path: '',
    component: CasesComponent,
  },
  {
    path: ':id',
    component: CasesTableComponent,
  },
  {
    path: 'edit/:id/:templateId',
    component: CasesEditComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule {
}
