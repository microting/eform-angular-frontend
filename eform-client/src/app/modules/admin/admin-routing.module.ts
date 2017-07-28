import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChangePasswordComponent} from 'app/modules/admin/components/change-password/change-password.component';
import {UserComponent} from 'app/modules/admin/components/user/user.component';

const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
