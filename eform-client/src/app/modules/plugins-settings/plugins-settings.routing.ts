import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  PluginsSettingsPageComponent
} from './components';

const routes: Routes = [
  {
    path: '',
    component: PluginsSettingsPageComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsSettingsRouting {
}
