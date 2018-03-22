import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Layouts
import {FullLayoutComponent} from './layouts/fulllayout/fulllayout.component';
import {SimpleLayoutComponent} from 'app/layouts/simple-layout/simple-layout.component';
import {AuthComponent} from 'app/components/auth/auth.component';
import {AuthGuard} from 'app/guards/auth.guard';
import {RestorePasswordComponent} from './components/auth/restore-password.component';

export const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: './modules/eform/eform.module#EFormModule'
      },
      {
        path: 'advanced',
        canActivate: [AuthGuard],
        loadChildren: './modules/advanced/advanced.module#AdvancedModule'
      },
      {
        path: 'simplesites',
        canActivate: [AuthGuard],
        loadChildren: './modules/simple-sites/simple-sites.module#SimpleSitesModule'
      },
      {
        path: 'cases',
        canActivate: [AuthGuard],
        loadChildren: './modules/cases/cases.module#CasesModule'
      },
      {
        path: 'settings',
        loadChildren: './modules/settings/settings.module#SettingsModule'
      },
      {
        path: 'account-management',
        canActivate: [AuthGuard],
        loadChildren: './modules/account-management/account-management.module#AccountManagementModule'
      }
    ]
  },
  {
    path: 'login',
    component: SimpleLayoutComponent,
    data: {
      title: 'Login'
    },
    children: [
      {
        path: '',
        component: AuthComponent,
      },
      {
        path: 'restore-password',
        component: RestorePasswordComponent
      }
    ]
  },
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
