import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
// Layouts
import {FullLayoutComponent} from './layouts/fulllayout/fulllayout.component';
import {SimpleLayoutComponent} from 'app/layouts/simple-layout/simple-layout.component';
import {AuthComponent} from 'app/components/auth/auth.component';

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
        loadChildren: './modules/eform/eform.module#EFormModule'
      },
      {
        path: 'advanced',
        loadChildren: './modules/advanced/advanced.module#AdvancedModule'
      },
      {
        path: 'simplesites',
        loadChildren: './modules/simple-sites/simple-sites.module#SimpleSitesModule'
      },
      {
        path: 'cases',
        loadChildren: './modules/cases/cases.module#CasesModule'
      },
      {
        path: 'settings',
        loadChildren: './modules/settings/settings.module#SettingsModule'
      },
      {
        path: 'admin',
        loadChildren: './modules/admin/admin.module#AdminModule'
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
