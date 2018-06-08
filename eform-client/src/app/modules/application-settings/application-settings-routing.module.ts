import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConnectionStringComponent} from './components/connection-string/connection-string.component';
import {AdminSettingsComponent} from './components/admin-settings/admin-settings.component';
import {AuthGuard} from 'app/guards/auth.guard';


const routes: Routes = [
  {
    path: 'connection-string',
    component: ConnectionStringComponent,
  },
  {
    canActivate: [AuthGuard],
    path: '',
    component: AdminSettingsComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationSettingsRoutingModule {
}
