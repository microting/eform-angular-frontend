import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IsAuthGuard} from 'src/app/common/guards';
import {FullLayoutComponent, SimpleLayoutComponent, ConnectionSetupComponent, NotFoundComponent} from './components';
import {UserClaimsEnum} from 'src/app/common/const';

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
        data: {requiredClaim: UserClaimsEnum.emailRecipientRead},
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
      {
        path: 'open-source-licenses',
        loadChildren: () =>
          import('./modules/open-source-licenses/open-source-licenses.module').then(
            (m) => m.OpenSourceLicensesModule
          ),
      },
      {
        path: 'cms',
        canActivate: [IsAuthGuard],
        loadChildren: () =>
          import('./modules/cms/cms.module').then((m) => m.CmsModule),
      },
    ],
  },
  {
    path: 'landing',
    component: SimpleLayoutComponent,
    loadChildren: () =>
      import('./modules/cms-public/cms-public.module').then((m) => m.CmsPublicModule),
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
  // Anything else: a not-found page that keeps the URL, instead of silently
  // redirecting to My eForms (#8103). It must stay the last app route —
  // PluginsModule is also imported eagerly by AppModule, so the plugin routes
  // are appended after it at root level, where nothing can reach them.
  {
    path: '**',
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        canActivate: [IsAuthGuard],
        component: NotFoundComponent,
      },
    ],
  },
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
    console.debug('AppRoutingModule - constructor');
  }
}
