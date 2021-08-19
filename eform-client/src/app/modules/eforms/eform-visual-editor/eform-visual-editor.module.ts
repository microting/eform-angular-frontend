import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DragulaModule } from 'ng2-dragula';
import { EformImportedModule } from 'src/app/common/modules/eform-imported/eform-imported.module';
import { EformSharedTagsModule } from 'src/app/common/modules/eform-shared-tags/eform-shared-tags.module';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import {
  VisualEditorChecklistModalComponent,
  EformVisualEditorContainerComponent,
  VisualEditorFieldModalComponent,
  EformVisualEditorHeaderComponent,
  EformVisualEditorTagsComponent,
  VisualEditorFieldComponent,
  VisualEditorChecklistComponent,
  VisualEditorFieldDeleteModalComponent,
  VisualEditorChecklistDeleteModalComponent,
  VisualEditorAdditionalFieldNumberComponent,
  VisualEditorAdditionalFieldSaveButtonComponent,
  VisualEditorAdditionalFieldPdfComponent,
  VisualEditorAdditionalFieldOptionsComponent,
} from './components';
import { EformVisualEditorRouting } from './eform-visual-editor.routing';

@NgModule({
  declarations: [
    EformVisualEditorContainerComponent,
    EformVisualEditorHeaderComponent,
    EformVisualEditorTagsComponent,
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
  ],
  imports: [
    CommonModule,
    EformVisualEditorRouting,
    CommonModule,
    EformSharedModule,
    TranslateModule,
    MDBBootstrapModule,
    NgSelectModule,
    FormsModule,
    DragulaModule,
    EformImportedModule,
    FontAwesomeModule,
    EformSharedTagsModule,
  ],
})
export class EformVisualEditorModule {}
