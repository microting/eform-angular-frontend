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
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';

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
