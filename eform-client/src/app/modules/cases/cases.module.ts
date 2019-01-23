import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {TranslateModule} from '@ngx-translate/core';
import {OWL_DATE_TIME_FORMATS, OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {MY_MOMENT_FORMATS} from 'src/app/common/helpers';
import {EformImportedModule} from 'src/app/common/modules/eform-imported/eform-imported.module';

import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {CasesRoutingModule} from './cases.routing';
import {
  CaseEditComponent,
  CaseEditElementComponent,
  CaseEditSwitchComponent,
  CasesTableComponent,
  CaseEditConfirmationComponent,
  ElementAudioComponent,
  ElementCheckboxComponent,
  ElementCommentComponent, ElementContainerComponent,
  ElementDateComponent,
  ElementEntitysearchComponent,
  ElementEntityselectComponent, ElementInfoboxComponent, ElementMultiselectComponent,
  ElementNumberComponent,
  ElementNumberStepperComponent,
  ElementPdfComponent,
  ElementSingleselectComponent,
  ElementTextComponent,
  RemoveCaseModalComponent,
  ElementTimerComponent,
  ElementPictureComponent,
  ElementSignatureComponent
} from './components';

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
    OwlMomentDateTimeModule,
    FormsModule
  ],
  declarations: [
    CasesTableComponent,
    CaseEditComponent,
    CaseEditSwitchComponent,
    CaseEditElementComponent,
    CaseEditConfirmationComponent,
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
    ElementSignatureComponent],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ],
})
export class CasesModule {
}
