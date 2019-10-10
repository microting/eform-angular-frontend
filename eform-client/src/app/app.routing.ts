import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdminGuard, AuthGuard} from 'src/app/common/guards';
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './components';


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
        loadChildren: './modules/eforms/eforms.module#EFormsModule'
      },
      {
        path: 'advanced',
        canActivate: [AuthGuard],
        loadChildren: './modules/advanced/advanced.module#AdvancedModule'
      },
      {
        path: 'device-users',
        canActivate: [AuthGuard],
        loadChildren: './modules/device-users/device-users.module#DeviceUsersModule'
      },
      {
        path: 'cases',
        canActivate: [AuthGuard],
        loadChildren: './modules/cases/cases.module#CasesModule'
      },
      {
        path: 'application-settings',
        loadChildren: './modules/application-settings/application-settings.module#ApplicationSettingsModule'
      },
      {
        path: 'plugins-settings',
        canActivate: [AdminGuard],
        loadChildren: './modules/plugins-management/plugins-management.module#PluginsManagementModule'
      },
      {
        path: 'account-management',
        canActivate: [AuthGuard],
        loadChildren: './modules/account-management/account-management.module#AccountManagementModule'
      },
      {
        path: 'security',
        canActivate: [AdminGuard],
        loadChildren: './modules/security/security.module#SecurityModule'
      },
      {
        path: 'plugins',
        canActivate: [AuthGuard],
        loadChildren: './plugins/plugins.module#PluginsModule'
      }
    ]
  },
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    data: {
      title: 'Auth'
    },
    loadChildren: './modules/auth/auth.module#AuthModule'
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
