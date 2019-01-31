import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';

import {
  EformPageSubheaderComponent,
  EformPaginationComponent,
  EformSpinnerComponent,
  EformPageSizeComponent,
  StatusBarComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule
  ],
  declarations: [
    EformPageSubheaderComponent,
    EformPaginationComponent,
    EformSpinnerComponent,
    EformPageSizeComponent,
    StatusBarComponent
  ],
  exports: [
    EformPageSubheaderComponent,
    EformPaginationComponent,
    EformSpinnerComponent,
    EformPageSizeComponent,
    StatusBarComponent
  ]
})
export class EformSharedModule {
}
