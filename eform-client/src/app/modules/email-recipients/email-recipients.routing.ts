import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmailRecipientsPageComponent} from './components';

const routes: Routes = [
  {
    path: '',
    component: EmailRecipientsPageComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRecipientsRouting {
}
