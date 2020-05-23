import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserClaimsEnum} from 'src/app/common/const';
import {ClaimsGuard} from 'src/app/common/guards/claims.guard';
import {
  EntitySearchComponent,
  EntitySelectComponent, EntitySelectEditComponent,
  FoldersComponent,
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
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.unitsRead}
  },
  {
    path: 'sites',
    component: SitesComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.sitesRead}
  },
  {
    path: 'workers',
    component: WorkersComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.workersRead}
  },
  {
    path: 'workeredit/:id',
    component: WorkerEditComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.workersUpdate}
  },
  {
    path: 'siteedit/:id',
    component: SiteEditComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.sitesUpdate}
  },
  {
    path: 'entity-search',
    component: EntitySearchComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySearchRead}
  },
  {
    path: 'entity-select',
    component: EntitySelectComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectRead}
  },
  {
    path: 'entity-select/:id',
    component: EntitySelectEditComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectUpdate}
  },
  {
    path: 'folders',
    component: FoldersComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectRead}
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancedRoutingModule {
}
