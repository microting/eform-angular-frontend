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
import {
  ButtonsModule,
  CardsModule,
  CollapseModule,
  InputsModule,
  ModalModule,
  TableModule,
  TooltipModule,
  WavesModule,
} from 'angular-bootstrap-md';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';

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
    ButtonsModule,
    TranslateModule,
    FontAwesomeModule,
    NgSelectModule,
    InputsModule,
    TableModule,
    CardsModule,
    DragulaModule,
    TooltipModule,
    FormsModule,
    CollapseModule,
    EformSharedModule,
    WavesModule,
    ModalModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatCardModule,
  ],
})
export class NavigationMenuModule {}
