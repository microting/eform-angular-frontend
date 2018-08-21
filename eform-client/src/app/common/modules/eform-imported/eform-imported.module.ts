import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PellModule} from 'src/app/common/modules/eform-imported/pell/pell.module';
import {NgDatepickerModule} from './ng-datepicker/module/ng-datepicker.module';

@NgModule({
  imports: [
    CommonModule,
    NgDatepickerModule,
    PellModule,
  ],
  declarations: [
  ],
  exports: [
    NgDatepickerModule,
    PellModule
  ]
})
export class EformImportedModule {
}
