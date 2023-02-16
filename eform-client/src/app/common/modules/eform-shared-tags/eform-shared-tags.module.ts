import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';

import {
  SharedTagDeleteComponent, SharedTagEditComponent, SharedTagsComponent, SharedTagCreateComponent, EformsTagsComponent,
} from './components';
import {TreeModule} from '@circlon/angular-tree-component';
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
        NgSelectModule,
        FormsModule,
        TreeModule,
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
  ],
  exports: [
    SharedTagDeleteComponent,
    SharedTagEditComponent,
    SharedTagCreateComponent,
    SharedTagsComponent,
    EformsTagsComponent,
  ],
})
export class EformSharedTagsModule {}
