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
} from './components';
import {
  AuthImagePipe,
  AuthAudioPipe,
  SafeHtmlPipe,
} from 'src/app/common/pipes';
import {TreeModule} from '@circlon/angular-tree-component';
import {EformTableHeadersComponent} from './components';
import {RouterModule} from '@angular/router';
import {DragulaModule} from 'ng2-dragula';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatTreeModule} from '@angular/material/tree';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

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
        MatTooltipModule
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
  ],
})
export class EformSharedModule {
}
