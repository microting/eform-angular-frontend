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
// TODO import {
//   ButtonsModule,
//   CardsModule,
//   CollapseModule,
//   InputsModule,
//   ModalModule,
//   TableModule,
//   TooltipModule,
//   WavesModule,
// } from 'angular-bootstrap-md';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { DragulaModule } from 'ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EformSharedModule } from 'src/app/common/modules/eform-shared/eform-shared.module';
import {MdbTooltipModule} from 'mdb-angular-ui-kit/tooltip';

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
// TODO    ButtonsModule,
    TranslateModule,
    FontAwesomeModule,
    NgSelectModule,
// TODO    InputsModule,
// TODO    TableModule,
// TODO    CardsModule,
    DragulaModule,
// TODO    TooltipModule,
    FormsModule,
// TODO    CollapseModule,
    EformSharedModule,
// TODO    WavesModule,
// TODO    ModalModule,
    ReactiveFormsModule,
    MdbTooltipModule,
  ],
})
export class NavigationMenuModule {}
