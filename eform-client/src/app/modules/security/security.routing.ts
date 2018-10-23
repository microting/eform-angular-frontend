import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  SecurityGroupCreateComponent,
  SecurityGroupUpdateComponent,
  SecurityPageComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: SecurityPageComponent,
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
