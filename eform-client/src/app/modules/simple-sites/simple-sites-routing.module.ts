import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SimpleSitesTableComponent} from 'app/modules/simple-sites/components/simple-sites-table/simple-sites-table.component';
import {SimpleSiteEditComponent} from './components/simple-site-edit/simple-site-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SimpleSitesTableComponent,
  },
  {
    path: 'simplesiteedit/:id',
    component: SimpleSiteEditComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimpleSitesRoutingModule {
}
