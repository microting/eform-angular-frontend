import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';

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
  EntityListElementsComponent,
} from './components';
import {
  AuthImagePipe,
  AuthAudioPipe,
  SafeHtmlPipe,
} from 'src/app/common/pipes';
import {TreeModule} from '@circlon/angular-tree-component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformTableHeadersComponent} from './components';
import {RouterModule} from '@angular/router';
import {DragulaModule} from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    TreeModule,
    FontAwesomeModule,
    RouterModule,
    DragulaModule,
    MDBBootstrapModule
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
    EntityListElementsComponent,
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
    EntityListElementsComponent
  ],
})
export class EformSharedModule {
}
