import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationMenuCustomComponent,
  NavigationMenuCustomDropdownComponent,
  NavigationMenuCustomLinkComponent,
  NavigationMenuItemComponent,
  NavigationMenuItemDeleteComponent,
  NavigationMenuItemEditComponent,
  NavigationMenuPageComponent,
  NavigationMenuTemplateItemComponent,
  NavigationMenuResetComponent,
} from './components';
import { NavigationMenuRouting } from './navigation-menu.routing';
import { TranslateModule } from '@ngx-translate/core';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    NavigationMenuPageComponent,
    NavigationMenuItemComponent,
    NavigationMenuTemplateItemComponent,
    NavigationMenuCustomComponent,
    NavigationMenuCustomDropdownComponent,
    NavigationMenuCustomLinkComponent,
    NavigationMenuItemDeleteComponent,
    NavigationMenuItemEditComponent,
    NavigationMenuResetComponent,
  ],
  imports: [
    CommonModule,
    NavigationMenuRouting,
    TranslateModule,
    DragulaModule,
    FormsModule,
    EformSharedModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatGridListModule,
    MatExpansionModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MtxSelectModule,
    MatInputModule,
  ],
})
export class NavigationMenuModule {}
