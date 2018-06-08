import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PreloadResolverConfig} from 'app/configs';
import {FullLayoutComponent, SimpleLayoutComponent} from 'app/layouts';
import {RestorePasswordComponent, AuthComponent, SignOutComponent} from 'app/components';
import {AuthGuard} from 'app/guards';

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
        path: 'application-settings',
        loadChildren: './modules/application-settings/application-settings.module#ApplicationSettingsModule'
      },
      {
        path: 'account-management',
        canActivate: [AuthGuard],
        loadChildren: './modules/account-management/account-management.module#AccountManagementModule'
      },
      {
        path: 'plugins',
        canActivate: [AuthGuard],
        loadChildren: './plugins/plugins.module#PluginsModule',
        data: { preload: true }
      },
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
      },
      {
        path: 'sign-out',
        component: SignOutComponent
      }
    ]
  },
  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false, preloadingStrategy: PreloadResolverConfig })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
