import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
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
} from './components';
import {EformVisualEditorRouting} from './eform-visual-editor.routing';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MtxSelectModule} from '@ng-matero/extensions/select';

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
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MtxSelectModule,
  ],
})
export class EformVisualEditorModule {
}
