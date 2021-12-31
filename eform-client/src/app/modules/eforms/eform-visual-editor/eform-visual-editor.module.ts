import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
// TODO import { MDBBootstrapModule } from 'angular-bootstrap-md';
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
  VisualEditorAdditionalFieldEntitySearchComponent,
  VisualEditorAdditionalFieldEntitySelectComponent,
} from './components';
import { EformVisualEditorRouting } from './eform-visual-editor.routing';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';
import {MdbPopoverModule} from 'mdb-angular-ui-kit/popover';
import {MdbCollapseModule} from 'mdb-angular-ui-kit/collapse';

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
    VisualEditorAdditionalFieldEntitySearchComponent,
    VisualEditorAdditionalFieldEntitySelectComponent,
  ],
  imports: [
    CommonModule,
    EformVisualEditorRouting,
    CommonModule,
    EformSharedModule,
    TranslateModule,
// TODO     MDBBootstrapModule,
    NgSelectModule,
    FormsModule,
    DragulaModule,
    EformImportedModule,
    FontAwesomeModule,
    EformSharedTagsModule,
    MdbTooltipModule,
    MdbPopoverModule,
    MdbCollapseModule,
  ],
})
export class EformVisualEditorModule {}
