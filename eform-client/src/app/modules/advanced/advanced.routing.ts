import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserClaimsEnum} from 'src/app/common/const';
import {ClaimsGuard, IsClaimsGuard} from 'src/app/common/guards/claims.guard';
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
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.unitsRead}
  },
  {
    path: 'sites',
    component: SitesComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.sitesRead}
  },
  {
    path: 'workers',
    component: WorkersComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.workersRead}
  },
  {
    path: 'entity-search',
    component: EntitySearchComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySearchRead}
  },
  {
    path: 'entity-search/edit/:id',
    component: EntityEditCreateComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySearchRead, header: 'searchable'}
  },
  {
    path: 'entity-search/create',
    component: EntityEditCreateComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySearchRead, header: 'searchable'}
  },
  {
    path: 'entity-select',
    component: EntitySelectComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectRead}
  },
  {
    path: 'entity-select/edit/:id',
    component: EntityEditCreateComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectUpdate, header: 'selectable'}
  },
  {
    path: 'entity-select/create',
    component: EntityEditCreateComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.entitySelectUpdate, header: 'selectable'}
  },
  {
    path: 'folders',
    component: FoldersComponent,
    canActivate: [IsClaimsGuard],
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
