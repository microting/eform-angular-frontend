import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard, CanDeactivateGuard} from 'src/app/common/guards';
import {CaseEditComponent, CasesTableComponent} from 'src/app/modules/cases/components';

const routes: Routes = [

  {
    path: ':id',
    component: CasesTableComponent,
  },
  {
    path: 'edit/:id/:templateId',
    component: CaseEditComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  // {
  //   path: 'posts',
  //   canActivate: [AuthGuard],
  //   loadChildren: './plugins/plugins.module#PluginsModule'
  // }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule {
}
