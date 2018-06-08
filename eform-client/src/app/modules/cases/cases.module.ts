import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CasesRoutingModule} from './cases-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxGalleryModule} from 'ngx-gallery';

import {
  ElementCheckboxComponent,
  ElementCommentComponent,
  ElementDateComponent,
  ElementMultiselectComponent,
  ElementNumberComponent,
  ElementPictureComponent,
  ElementPdfComponent,
  ElementSingleselectComponent,
  ElementContainerComponent,
  ElementTextComponent,
  ElementInfoboxComponent,
  ElementTimerComponent,
  ElementSignatureComponent,
  TrumbowygComponent,
  ElementEntitysearchComponent,
  ElementEntityselectComponent,
  CaseEditSwitchComponent,
  CaseEditElementComponent,
  CasesEditComponent,
  CasesTableComponent,
  CasesComponent
} from './components';
import {CollapseModule, TooltipModule} from 'ngx-bootstrap';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {NgxSelectModule} from 'ngx-select-ex';

@NgModule({
  imports: [
    CommonModule,
    NgxGalleryModule,
    FormsModule,
    ReactiveFormsModule,
    CasesRoutingModule,
    CollapseModule,
    TranslateModule.forChild(),
    Ng2Bs3ModalModule,
    TooltipModule,
    NgxSelectModule
  ],
  declarations: [CasesComponent,
    TrumbowygComponent,
    CasesEditComponent,
    CaseEditSwitchComponent,
    CasesTableComponent,
    CaseEditElementComponent,
    ElementCommentComponent,
    ElementMultiselectComponent,
    ElementPdfComponent,
    ElementSingleselectComponent,
    ElementNumberComponent,
    ElementTextComponent,
    ElementContainerComponent,
    ElementPictureComponent,
    ElementCheckboxComponent,
    ElementDateComponent,
    ElementInfoboxComponent,
    ElementTimerComponent,
    ElementSignatureComponent,
    ElementEntitysearchComponent,
    ElementEntityselectComponent
  ]
})
export class CasesModule {
}
