import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

import {
  DateFormatterComponent,
  EformCollapseToggleComponent,
  EformPageSizeComponent,
  EformPaginationComponent,
  EformSubheaderComponent,
  EformTreeViewPickerComponent,
  StatusBarComponent,
  EformTableHeaderSortableComponent,
  StatusBarCompactComponent,
} from './components';
import {
  AuthImagePipe,
  AuthAudioPipe,
  SafeHtmlPipe,
} from 'src/app/common/pipes';
import { TreeModule } from '@circlon/angular-tree-component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BreadcrumbModule, WavesModule } from 'angular-bootstrap-md';
import { EformTableHeadersComponent } from './components';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    TreeModule,
    FontAwesomeModule,
    WavesModule,
    BreadcrumbModule,
    RouterModule,
  ],
  declarations: [
    EformPaginationComponent,
    EformPageSizeComponent,
    EformSubheaderComponent,
    StatusBarComponent,
    DateFormatterComponent,
    AuthImagePipe,
    AuthAudioPipe,
    SafeHtmlPipe,
    EformTreeViewPickerComponent,
    EformCollapseToggleComponent,
    EformTableHeaderSortableComponent,
    EformTableHeadersComponent,
    StatusBarCompactComponent,
  ],
  exports: [
    EformPaginationComponent,
    EformPageSizeComponent,
    StatusBarComponent,
    DateFormatterComponent,
    EformTreeViewPickerComponent,
    EformTableHeadersComponent,
    AuthImagePipe,
    EformCollapseToggleComponent,
    AuthAudioPipe,
    SafeHtmlPipe,
    EformSubheaderComponent,
    StatusBarCompactComponent,
  ],
})
export class EformSharedModule {}
