import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenSourceLicensesRouting } from './open-source-licenses.routing';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    OpenSourceLicensesRouting,
    TranslateModule
  ]
})
export class OpenSourceLicensesModule {}
