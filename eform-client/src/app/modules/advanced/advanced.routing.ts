import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserClaimsEnum} from 'src/app/common/const';
import {ClaimsGuard} from 'src/app/common/guards/claims.guard';
import {
  EntitySearchComponent,
  EntitySelectComponent,
  FoldersComponent,
  SitesComponent,
  UnitsComponent,
  WorkersComponent
} from './components';
import {AuthGuard} from 'src/app/common/guards';
import { EntityEditCreateComponent } from 'src/app/common/modules/eform-shared/components';

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
    path: 'entity-search',
    component: EntitySearchComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySearchRead}
  },
  {
    path: 'entity-search/edit/:id',
    component: EntityEditCreateComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySearchRead, header: 'searchable'}
  },
  {
    path: 'entity-search/create',
    component: EntityEditCreateComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySearchRead, header: 'searchable'}
  },
  {
    path: 'entity-select',
    component: EntitySelectComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectRead}
  },
  {
    path: 'entity-select/edit/:id',
    component: EntityEditCreateComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectUpdate, header: 'selectable'}
  },
  {
    path: 'entity-select/create',
    component: EntityEditCreateComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectUpdate, header: 'selectable'}
  },
  {
    path: 'folders',
    component: FoldersComponent,
    canActivate: [ClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectRead}
  },
  {
    path: 'navigation-menu',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/navigation-menu/navigation-menu.module').then(m => m.NavigationMenuModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancedRoutingModule {
}
