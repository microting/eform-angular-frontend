import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CanDeactivateGuard} from 'src/app/common/guards';
import {CaseEditComponent, CasePostsPageComponent, CasesTableComponent} from './components';

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
  {
    path: 'posts/:id/:templateId/:postAction',
    component: CasePostsPageComponent,
  },
  {
    path: 'posts/:id/:templateId',
    component: CasePostsPageComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasesRoutingModule {
}
