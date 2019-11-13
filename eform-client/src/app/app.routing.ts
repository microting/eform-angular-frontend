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
        loadChildren: () => import('./modules/eforms/eforms.module').then(m => m.EFormsModule)
      },
      {
        path: 'advanced',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/advanced/advanced.module').then(m => m.AdvancedModule)
      },
      {
        path: 'simplesites',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/device-users/device-users.module').then(m => m.DeviceUsersModule)
      },
      {
        path: 'cases',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/cases/cases.module').then(m => m.CasesModule)
      },
      {
        path: 'application-settings',
        loadChildren: () => import('./modules/application-settings/application-settings.module').then(m => m.ApplicationSettingsModule)
      },
      {
        path: 'plugins-settings',
        canActivate: [AdminGuard],
        loadChildren: () => import('./modules/plugins-management/plugins-management.module').then(m => m.PluginsManagementModule)
      },
      {
        path: 'account-management',
        canActivate: [AuthGuard],
        loadChildren: () => import('./modules/account-management/account-management.module').then(m => m.AccountManagementModule)
      },
      {
        path: 'security',
        canActivate: [AdminGuard],
        loadChildren: () => import('./modules/security/security.module').then(m => m.SecurityModule)
      },
      {
        path: 'plugins',
        canActivate: [AuthGuard],
        loadChildren: () => import('./plugins/plugins.module').then(m => m.PluginsModule)
      }
    ]
  },
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    data: {
      title: 'Auth'
    },
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
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
