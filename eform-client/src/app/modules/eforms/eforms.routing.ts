import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EformsPageComponent} from './components/index';

const routes: Routes = [
  {
    path: '',
    component: EformsPageComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EformsRouting {
}
