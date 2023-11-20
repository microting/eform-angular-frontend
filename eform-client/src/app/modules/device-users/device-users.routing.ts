import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserClaimsEnum} from 'src/app/common/const';
import {ClaimsGuard, IsClaimsGuard} from 'src/app/common/guards/claims.guard';
import {DeviceUsersPageComponent} from './components';

const routes: Routes = [
  {
    path: '',
    component: DeviceUsersPageComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.deviceUsersRead}
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceUsersRouting {
}
