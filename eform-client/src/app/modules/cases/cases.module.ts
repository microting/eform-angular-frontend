import {FormsModule} from '@angular/forms';
import {CasesRoutingModule} from './cases-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GalleryModule} from 'ng-gallery';
import {CasesComponent} from './components/cases.component';
import {CasesTableComponent} from './components/cases-table/cases-table.component';
import {CasesEditComponent} from './components/cases-edit/cases-edit.component';
import {CaseEditElementComponent} from './components/case-edit-element/case-edit-element.component';

import {
  ElementCheckboxComponent,
  ElementCommentComponent,
  ElementDateComponent,
  ElementMultiselectComponent,
  ElementNumberComponent,
  ElementPictureComponent,
  ElementPdfComponent,
  ElementSingleselectComponent,
  ElementTextComponent,
  ElementInfoboxComponent,
  ElementTimerComponent,
  ElementSignatureComponent,
  TrumbowygComponent
} from './components/case-elements';

import {galleryConfig} from 'app/modules/helpers/helpers.module';

@NgModule({
  imports: [
    CommonModule,
    GalleryModule.forRoot(galleryConfig),
    FormsModule,
    CasesRoutingModule
  ],
  declarations: [CasesComponent,
    TrumbowygComponent,
    CasesEditComponent,
    CasesTableComponent,
    CaseEditElementComponent,
    ElementCommentComponent,
    ElementMultiselectComponent,
    ElementPdfComponent,
    ElementSingleselectComponent,
    ElementNumberComponent,
    ElementTextComponent,
    ElementPictureComponent,
    ElementCheckboxComponent,
    ElementDateComponent,
    ElementInfoboxComponent,
    ElementTimerComponent,
    ElementSignatureComponent
  ]
})
export class CasesModule {
}
