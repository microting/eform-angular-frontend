import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from '@danielmoncada/angular-datetime-picker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { GalleryModule } from '@ngx-gallery/core';
import { GallerizeModule } from '@ngx-gallery/gallerize';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MY_MOMENT_FORMATS } from 'src/app/common/helpers';
import { EformCasesModule } from 'src/app/common/modules/eform-cases/eform-cases.module';
import { EformImportedModule } from 'src/app/common/modules/eform-imported/eform-imported.module';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { CasesRoutingModule } from './cases.routing';
import {
  CaseEditComponent,
  CasePostNewComponent,
  CasePostsPageComponent,
  CasePostViewComponent,
  CasesTableComponent,
} from './components';
import { casePostsPersistProvider } from './components/case-posts/store';
import { casesPersistProvider } from './components/store';

@NgModule({
  imports: [
    TranslateModule,
    MDBBootstrapModule,
    EformSharedModule,
    CasesRoutingModule,
    CommonModule,
    NgSelectModule,
    EformImportedModule,
    GallerizeModule,
    LightboxModule,
    GalleryModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    FontAwesomeModule,
    EformCasesModule,
  ],
  declarations: [
    CasesTableComponent,
    CaseEditComponent,
    CasePostNewComponent,
    CasePostsPageComponent,
    CasePostViewComponent,
  ],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    casesPersistProvider,
    casePostsPersistProvider,
  ],
  exports: [CasePostNewComponent],
})
export class CasesModule {}
