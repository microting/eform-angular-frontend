import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmailRecipientsPageComponent} from './components';
import {ClaimsGuard, IsClaimsGuard} from 'src/app/common/guards';
import {UserClaimsEnum} from 'src/app/common/const';

const routes: Routes = [
  {
    path: '',
    component: EmailRecipientsPageComponent,
    canActivate: [IsClaimsGuard],
    data: {requiredClaim: UserClaimsEnum.emailRecipientRead},
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRecipientsRouting {
}
