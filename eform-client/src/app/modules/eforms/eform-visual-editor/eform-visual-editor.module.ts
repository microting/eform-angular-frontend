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
  VisualEditorAdditionalFieldDateComponent,
} from './components';
import {EformVisualEditorRouting} from './eform-visual-editor.routing';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MtxPopoverModule} from '@ng-matero/extensions/popover';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MtxGridModule} from '@ng-matero/extensions/grid';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from "@angular/material/datepicker";

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
    VisualEditorAdditionalFieldDateComponent,
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
    MatDatepickerModule,
  ],
})
export class EformVisualEditorModule {
}
