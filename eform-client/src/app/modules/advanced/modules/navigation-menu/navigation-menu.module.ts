import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationMenuPageComponent } from './components';
import { NavigationMenuRouting } from './navigation-menu.routing';
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {ButtonsModule, CardsModule, CollapseModule, InputsModule, TableModule, TooltipModule} from 'angular-bootstrap-md';
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgSelectModule} from '@ng-select/ng-select';
import {DragulaModule} from 'ng2-dragula';
import {FormsModule} from '@angular/forms';
import { NavigationMenuItemComponent } from './components/navigation-menu-item/navigation-menu-item.component';
import { NavigationMenuTemplateItemComponent } from './components/navigation-menu-template-item/navigation-menu-template-item.component';
import {EformSharedModule} from 'src/app/common/modules/eform-shared/eform-shared.module';
import { NavigationMenuCustomComponent } from './components/navigation-menu-custom/navigation-menu-custom.component';
import { NavigationMenuCustomDropdownComponent } from './components/navigation-menu-custom-dropdown/navigation-menu-custom-dropdown.component';
import { NavigationMenuCustomLinkComponent } from './components/navigation-menu-custom-link/navigation-menu-custom-link.component';

@NgModule({
  declarations: [
    NavigationMenuPageComponent,
    NavigationMenuItemComponent,
    NavigationMenuTemplateItemComponent,
    NavigationMenuCustomComponent,
    NavigationMenuCustomDropdownComponent,
    NavigationMenuCustomLinkComponent,
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
  ],
})
export class NavigationMenuModule {}
