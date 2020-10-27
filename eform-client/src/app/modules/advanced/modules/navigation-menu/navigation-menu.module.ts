import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationMenuCustomComponent,
  NavigationMenuCustomDropdownComponent,
  NavigationMenuCustomLinkComponent,
  NavigationMenuItemComponent,
  NavigationMenuItemDeleteComponent, NavigationMenuItemEditComponent,
  NavigationMenuPageComponent,
  NavigationMenuTemplateItemComponent,
} from './components';
import { NavigationMenuRouting } from './navigation-menu.routing';
import { SharedPnModule } from 'src/app/plugins/modules/shared/shared-pn.module';
import {
    ButtonsModule,
    CardsModule,
    CollapseModule,
    InputsModule, ModalModule,
    TableModule,
    TooltipModule,
    WavesModule,
} from 'angular-bootstrap-md';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule } from '@angular/forms';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';

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
  ],
  imports: [
    CommonModule,
    NavigationMenuRouting,
    SharedPnModule,
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
  ],
})
export class NavigationMenuModule {}
