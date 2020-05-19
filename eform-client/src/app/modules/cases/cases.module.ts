import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {TranslateModule} from '@ngx-translate/core';
// import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MY_MOMENT_FORMATS} from 'src/app/common/helpers';
import {EformImportedModule} from 'src/app/common/modules/eform-imported/eform-imported.module';

import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {CasesRoutingModule} from './cases.routing';
import {
  CaseEditComponent,
  CaseEditConfirmationComponent,
  CaseEditElementComponent,
  CaseEditSwitchComponent,
  CasesTableComponent,
  CasePostNewComponent,
  CasePostsPageComponent,
  CasePostViewComponent,
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
  RemoveCaseModalComponent, CaseEditNavComponent
} from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime-ex';
import {SharedPnModule} from '../../plugins/modules/shared/shared-pn.module';


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
    SharedPnModule
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
    ElementSignatureComponent
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
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
    CaseEditElementComponent
  ]
})
export class CasesModule {
}
