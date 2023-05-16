import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {EformImportedModule} from 'src/app/common/modules/eform-imported/eform-imported.module';
import {EformSharedTagsModule} from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  VisualEditorChecklistModalComponent,
  EformVisualEditorContainerComponent,
  VisualEditorFieldModalComponent,
  EformVisualEditorHeaderComponent,
  VisualEditorFieldComponent,
  VisualEditorChecklistComponent,
  VisualEditorFieldDeleteModalComponent,
  VisualEditorChecklistDeleteModalComponent,
  VisualEditorAdditionalFieldNumberComponent,
  VisualEditorAdditionalFieldSaveButtonComponent,
  VisualEditorAdditionalFieldPdfComponent,
  VisualEditorAdditionalFieldOptionsComponent,
  VisualEditorAdditionalFieldEntitySearchComponent,
  VisualEditorAdditionalFieldEntitySelectComponent,
  VisualEditorAdditionalFieldOptionEditComponent,
  VisualEditorAdditionalFieldOptionDeleteComponent,
} from './components';
import {EformVisualEditorRouting} from './eform-visual-editor.routing';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MtxPopoverModule} from '@ng-matero/extensions/popover';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';

@NgModule({
  declarations: [
    EformVisualEditorContainerComponent,
    EformVisualEditorHeaderComponent,
    VisualEditorFieldModalComponent,
    VisualEditorChecklistModalComponent,
    VisualEditorFieldComponent,
    VisualEditorChecklistComponent,
    VisualEditorFieldDeleteModalComponent,
    VisualEditorChecklistDeleteModalComponent,
    VisualEditorAdditionalFieldNumberComponent,
    VisualEditorAdditionalFieldSaveButtonComponent,
    VisualEditorAdditionalFieldPdfComponent,
    VisualEditorAdditionalFieldOptionsComponent,
    VisualEditorAdditionalFieldEntitySearchComponent,
    VisualEditorAdditionalFieldEntitySelectComponent,
    VisualEditorAdditionalFieldOptionEditComponent,
    VisualEditorAdditionalFieldOptionDeleteComponent,
  ],
  imports: [
    CommonModule,
    EformVisualEditorRouting,
    CommonModule,
    EformSharedModule,
    TranslateModule,
    FormsModule,
    DragulaModule,
    EformImportedModule,
    EformSharedTagsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MtxSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MtxPopoverModule,
    DragDropModule,
    MtxGridModule,
    MatSlideToggleModule,
  ],
})
export class EformVisualEditorModule {
}
