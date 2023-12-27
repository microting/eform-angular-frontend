import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminGuard, AuthGuard, ClaimsGuard, IsAdminGuard, IsAuthGuard, IsClaimsGuard} from 'src/app/common/guards';
import { FullLayoutComponent, SimpleLayoutComponent, ConnectionSetupComponent} from './components';
import { UserClaimsEnum } from 'src/app/common/const';

export const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: '',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/eforms/eforms.module').then((m) => m.EFormsModule),
      },
      {
        path: 'advanced',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/advanced/advanced.module').then(
            (m) => m.AdvancedModule
          ),
      },
      {
        path: 'device-users',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/device-users/device-users.module').then(
            (m) => m.DeviceUsersModule
          ),
      },
      {
        path: 'cases',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/cases/cases.module').then((m) => m.CasesModule),
      },
      {
        path: 'application-settings',
        loadChildren: () =>
          import(
            './modules/application-settings/application-settings.module'
          ).then((m) => m.ApplicationSettingsModule),
      },
      {
        path: 'plugins-settings',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/plugins-management/plugins-management.module').then(
            (m) => m.PluginsManagementModule
          ),
      },
      {
        path: 'account-management',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/account-management/account-management.module').then(
            (m) => m.AccountManagementModule
          ),
      },
      {
        path: 'email-recipients',
        canActivate: [IsAuthGuard],
        data: { requiredClaim: UserClaimsEnum.emailRecipientRead },
        loadChildren: () =>
          import('./modules/email-recipients/email-recipients.module').then(
            (m) => m.EmailRecipientsModule
          ),
      },
      {
        path: 'security',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/security/security.module').then(
            (m) => m.SecurityModule
          ),
      },
      {
        path: 'plugins',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./plugins/plugins.module').then((m) => m.PluginsModule),
      },
    ],
  },
  {
    path: 'auth',
    component: SimpleLayoutComponent,
    data: {
      title: 'Auth',
    },
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'connection-string',
    component: SimpleLayoutComponent,
    children: [
      {
        path: '',
        component: ConnectionSetupComponent
      }
    ],
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    useHash: false
}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor() {
    // eslint-disable-next-line no-console
    console.log('AppRoutingModule - constructor');
  }
}
