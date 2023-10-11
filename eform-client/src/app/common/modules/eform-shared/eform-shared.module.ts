import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';

import {
  DateFormatterComponent,
  EformCollapseToggleComponent,
  EformPaginationComponent,
  EformPageSizeComponent,// Added only in an transitive import until all plugins have been migrated to the new eform-pagination
  EformSubheaderComponent,
  EformTreeViewPickerComponent,
  StatusBarComponent,
  StatusBarCompactComponent,
  EntityListElementsComponent,
  EntityItemEditNameComponent,
  EformNewSubheaderComponent,
  EntityEditCreateComponent,
  EntityImportListComponent,
  DeleteModalComponent,
  EformTranslationComponent
} from './components';
import {
  AuthImagePipe,
  AuthAudioPipe,
  SafeHtmlPipe,
} from 'src/app/common/pipes';
import {EformTableHeadersComponent} from './components';
import {RouterModule} from '@angular/router';
import {DragulaModule} from 'ng2-dragula';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTreeModule} from '@angular/material/tree';
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FormattingTextEditorModule} from '../eform-imported/formatting-text-editor/formatting-text-editor.module';
import {TreeModule} from '@ali-hm/angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    TreeModule,
    RouterModule,
    DragulaModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTreeModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    FormattingTextEditorModule
  ],
  declarations: [
    EformPaginationComponent,
    EformPageSizeComponent,// Added only in an transitive import until all plugins have been migrated to the new eform-pagination
    EformSubheaderComponent,
    StatusBarComponent,
    DateFormatterComponent,
    AuthImagePipe,
    AuthAudioPipe,
    SafeHtmlPipe,
    EformTreeViewPickerComponent,
    EformCollapseToggleComponent,
    EformTableHeadersComponent,
    StatusBarCompactComponent,
    EntityListElementsComponent,
    EntityItemEditNameComponent,
    EformNewSubheaderComponent,
    EntityEditCreateComponent,
    EntityImportListComponent,
    DeleteModalComponent,
    EformTranslationComponent
  ],
  exports: [
    EformPaginationComponent,
    EformPageSizeComponent,// Added only in an transitive import until all plugins have been migrated to the new eform-pagination
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
    EntityListElementsComponent,
    EntityItemEditNameComponent,
    EformNewSubheaderComponent,
    EntityEditCreateComponent,
    EntityImportListComponent,
    DeleteModalComponent,
    EformTranslationComponent
  ],
})
export class EformSharedModule {
}
