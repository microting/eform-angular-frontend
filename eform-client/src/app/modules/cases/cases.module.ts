import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {GalleryModule} from '@ngx-gallery/core';
import {GallerizeModule} from '@ngx-gallery/gallerize';
import {LightboxModule} from '@ngx-gallery/lightbox';
import {TranslateModule} from '@ngx-translate/core';
import {MDBBootstrapModule} from 'port/angular-bootstrap-md';
import {EformImportedModule} from 'src/app/common/modules/eform-imported/eform-imported.module';

import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import {CasesRoutingModule} from './cases.routing';
import {
  CaseEditComponent,
  CaseEditElementComponent,
  CaseEditSwitchComponent,
  CasesTableComponent,
  ElementAudioComponent,
  ElementCheckboxComponent,
  ElementCommentComponent, ElementContainerComponent,
  ElementDateComponent,
  ElementEntitysearchComponent,
  ElementEntityselectComponent, ElementInfoboxComponent, ElementMultiselectComponent,
  ElementNumberComponent,
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
    GalleryModule
  ],
  declarations: [
    CasesTableComponent,
    CaseEditComponent,
    CaseEditSwitchComponent,
    CaseEditElementComponent,
    ElementTextComponent,
    ElementNumberComponent,
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
    ElementSignatureComponent]
})
export class CasesModule {
}
