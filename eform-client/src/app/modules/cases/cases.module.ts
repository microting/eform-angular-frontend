import {FormsModule} from '@angular/forms';
import {CasesRoutingModule} from './cases-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
  ElementSignatureComponent,
  ElementSingleselectComponent,
  ElementTextComponent,
  TrumbowygComponent
} from './components/case-elements';

@NgModule({
  imports: [
    CommonModule,
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
    ElementSingleselectComponent,
    ElementNumberComponent,
    ElementTextComponent,
    ElementPictureComponent,
    ElementSignatureComponent,
    ElementCheckboxComponent,
    ElementDateComponent
  ]
})
export class CasesModule {
}
