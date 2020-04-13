import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {FileUploadModule} from 'ng2-file-upload';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {EformsRouting} from './eforms.routing';
import {
  EformCreateModalComponent,
  EformEditParingModalComponent,
  EformsPageComponent,
  EformColumnsModalComponent,
  EformEditTagsModalComponent,
  EformRemoveEformModalComponent, EformUploadZipModalComponent
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    EformsRouting,
    NgSelectModule,
    MDBBootstrapModule,
    EformSharedModule,
    FileUploadModule,
    FormsModule,
    TranslateModule.forChild(),
    FontAwesomeModule
  ],
  declarations: [
    EformsPageComponent,
    EformEditParingModalComponent,
    EformCreateModalComponent,
    EformColumnsModalComponent,
    EformEditTagsModalComponent,
    EformRemoveEformModalComponent,
    EformUploadZipModalComponent
  ]
})
export class EFormsModule { }
