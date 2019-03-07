import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  InstalledPluginsPageComponent, MarketplacePluginsPageComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: InstalledPluginsPageComponent,
  },
  {
    path: 'marketplace',
    component: MarketplacePluginsPageComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsManagementRouting {
}
