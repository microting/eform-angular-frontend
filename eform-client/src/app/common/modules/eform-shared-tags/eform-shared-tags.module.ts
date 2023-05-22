import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {
  SharedTagDeleteComponent,
  SharedTagEditComponent,
  SharedTagsComponent,
  SharedTagCreateComponent,
  SharedTagMultipleCreateComponent,
  EformsTagsComponent,
} from './components';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  declarations: [
    SharedTagDeleteComponent,
    SharedTagEditComponent,
    SharedTagCreateComponent,
    SharedTagsComponent,
    EformsTagsComponent,
    SharedTagMultipleCreateComponent,
  ],
  exports: [
    SharedTagDeleteComponent,
    SharedTagEditComponent,
    SharedTagCreateComponent,
    SharedTagsComponent,
    EformsTagsComponent,
    SharedTagMultipleCreateComponent,
  ],
})
export class EformSharedTagsModule {
}
