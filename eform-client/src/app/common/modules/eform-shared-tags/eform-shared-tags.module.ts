import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';

import {
  SharedTagDeleteComponent, SharedTagEditComponent, SharedTagsComponent, SharedTagCreateComponent
} from './components';
import {TreeModule} from '@circlon/angular-tree-component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
// TODO import {ButtonsModule, InputsModule, ModalModule, WavesModule} from 'angular-bootstrap-md';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    TreeModule,
    FontAwesomeModule,
// TODO    WavesModule,
// TODO    ModalModule,
// TODO    ButtonsModule,
// TODO    InputsModule,
  ],
  declarations: [
    SharedTagDeleteComponent,
    SharedTagEditComponent,
    SharedTagCreateComponent,
    SharedTagsComponent,
  ],
  exports: [
    SharedTagDeleteComponent,
    SharedTagEditComponent,
    SharedTagCreateComponent,
    SharedTagsComponent,
  ],
})
export class EformSharedTagsModule {}
