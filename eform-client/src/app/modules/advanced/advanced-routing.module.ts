import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SitesComponent} from './components/sites/sites.component';
import {UnitsComponent} from './components/units/units.component';
import {WorkersComponent} from './components/workers/workers.component';
import {WorkerEditComponent} from './components/worker-edit/worker-edit.component';
import {SiteEditComponent} from './components/site-edit/site-edit.component';
import {EntitySearchComponent} from './components/entity-search/entity-search.component';
import {EntitySelectComponent} from './components/entity-select/entity-select.component';

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
