import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  EntitySearchComponent,
  EntitySelectComponent,
  SiteEditComponent,
  SitesComponent,
  UnitsComponent,
  WorkerEditComponent,
  WorkersComponent
} from './components';

const routes: Routes = [
  {
    path: 'units',
    component: UnitsComponent,
  },
  {
    path: 'sites',
    component: SitesComponent
  },
  {
    path: 'workers',
    component: WorkersComponent
  },
  {
    path: 'workeredit/:id',
    component: WorkerEditComponent
  },
  {
    path: 'siteedit/:id',
    component: SiteEditComponent
  },
  {
    path: 'entity-search',
    component: EntitySearchComponent
  },
  {
    path: 'entity-select',
    component: EntitySelectComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancedRoutingModule {
}
