import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicensePageComponent } from './components/license-page/license-page.component';

const routes: Routes = [
  {
    path: '',
    component: LicensePageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenSourceLicensesRouting {}
