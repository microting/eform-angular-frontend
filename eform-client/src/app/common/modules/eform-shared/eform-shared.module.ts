import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';

import {
  DateFormatterComponent,
  EformPageSizeComponent,
  EformPageSubheaderComponent,
  EformPaginationComponent,
  EformTreeViewPickerComponent,
  StatusBarComponent,
} from './components';
import {AuthImagePipe} from 'src/app/common/pipes';
import {TreeModule} from '@circlon/angular-tree-component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {WavesModule} from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    TreeModule,
    FontAwesomeModule,
    WavesModule,
  ],
  declarations: [
    EformPageSubheaderComponent,
    EformPaginationComponent,
    EformPageSizeComponent,
    StatusBarComponent,
    DateFormatterComponent,
    AuthImagePipe,
    EformTreeViewPickerComponent,
  ],
  exports: [
    EformPageSubheaderComponent,
    EformPaginationComponent,
    EformPageSizeComponent,
    StatusBarComponent,
    DateFormatterComponent,
    EformTreeViewPickerComponent,
    AuthImagePipe,
  ],
})
export class EformSharedModule {}
