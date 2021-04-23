import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GalleryModule } from '@ngx-gallery/core';
import { GallerizeModule } from '@ngx-gallery/gallerize';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { TranslateModule } from '@ngx-translate/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MY_MOMENT_FORMATS } from 'src/app/common/helpers';
import { EformImportedModule } from 'src/app/common/modules/eform-imported/eform-imported.module';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import { CasesRoutingModule } from './cases.routing';
import {
  CaseEditComponent,
  CaseEditConfirmationComponent,
  CaseEditElementComponent,
  CaseEditNavComponent,
  CaseEditSwitchComponent,
  CasePostNewComponent,
  CasePostsPageComponent,
  CasePostViewComponent,
  CasesTableComponent,
  ElementAudioComponent,
  ElementCheckboxComponent,
  ElementCommentComponent,
  ElementContainerComponent,
  ElementDateComponent,
  ElementEntitysearchComponent,
  ElementEntityselectComponent,
  ElementInfoboxComponent,
  ElementMultiselectComponent,
  ElementNumberComponent,
  ElementNumberStepperComponent,
  ElementPdfComponent,
  ElementPictureComponent,
  ElementSignatureComponent,
  ElementSingleselectComponent,
  ElementTextComponent,
  ElementTimerComponent,
  RemoveCaseModalComponent,
} from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  OWL_DATE_TIME_FORMATS,
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
} from 'ng-pick-datetime-ex';
import { casesPersistProvider } from './components/store/cases-store';
import { casePostsPersistProvider } from './components/case-posts/store/case-posts-store';
// import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';

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
    // OwlMomentDateTimeModule,
    FormsModule,
    FontAwesomeModule,
  ],
  declarations: [
    CasesTableComponent,
    CaseEditComponent,
    CaseEditNavComponent,
    CaseEditSwitchComponent,
    CaseEditElementComponent,
    CaseEditConfirmationComponent,
    CasePostNewComponent,
    CasePostsPageComponent,
    CasePostViewComponent,
    ElementTextComponent,
    ElementNumberComponent,
    ElementNumberStepperComponent,
    ElementCheckboxComponent,
    ElementSingleselectComponent,
    ElementPdfComponent,
    ElementAudioComponent,
    ElementDateComponent,
    ElementCommentComponent,
    ElementEntityselectComponent,
    ElementEntitysearchComponent,
    ElementMultiselectComponent,
    ElementInfoboxComponent,
    ElementTimerComponent,
    RemoveCaseModalComponent,
    ElementContainerComponent,
    ElementPictureComponent,
    ElementSignatureComponent,
  ],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    casesPersistProvider,
    casePostsPersistProvider,
  ],
  exports: [
    ElementCommentComponent,
    ElementNumberStepperComponent,
    ElementNumberComponent,
    ElementCheckboxComponent,
    ElementTextComponent,
    ElementDateComponent,
    ElementSingleselectComponent,
    ElementMultiselectComponent,
    ElementContainerComponent,
    ElementEntitysearchComponent,
    ElementEntityselectComponent,
    CaseEditNavComponent,
    CaseEditElementComponent,
    CasePostNewComponent,
  ],
})
export class CasesModule {}
