import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {EformPageSubheaderComponent, EformPaginationComponent, EformSpinnerComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    EformPageSubheaderComponent,
    EformPaginationComponent,
    EformSpinnerComponent
  ],
  exports: [
    EformPageSubheaderComponent,
    EformPaginationComponent,
    EformSpinnerComponent
  ]
})
export class EformSharedModule {
}
