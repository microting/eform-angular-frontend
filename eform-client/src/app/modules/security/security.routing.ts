import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  SecurityGroupCreateComponent, SecurityGroupEformsPermissionsComponent, SecurityGroupGeneralPermissionsComponent,
  SecurityGroupUpdateComponent,
  SecurityPageComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: SecurityPageComponent,
  },
  {
    path: 'group/eforms-permissions',
    component: SecurityGroupEformsPermissionsComponent,
  },
  {
    path: 'group/general-permissions',
    component: SecurityGroupGeneralPermissionsComponent,
  },
  {
    path: 'create-group',
    component: SecurityGroupCreateComponent,
  },
  {
    path: 'update-group/:id',
    component: SecurityGroupUpdateComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRouting {
}
