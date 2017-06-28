import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConnectionStringComponent} from './components/connection-string/connection-string.component';


const routes: Routes = [
  {
    path: 'connection-string',
    component: ConnectionStringComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
