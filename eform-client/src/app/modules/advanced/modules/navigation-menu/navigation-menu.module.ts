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
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MtxSelectModule} from '@ng-matero/extensions/select';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';

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
