import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationMenuPageComponent } from './components';
import { NavigationMenuRouting } from './navigation-menu.routing';
import {SharedPnModule} from 'src/app/plugins/modules/shared/shared-pn.module';
import {ButtonsModule, CardsModule, InputsModule, TableModule, TooltipModule} from 'angular-bootstrap-md';
import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgSelectModule} from '@ng-select/ng-select';
import { NavigationMenuTemplatesComponent } from './components/navigation-menu-templates/navigation-menu-templates.component';
import { NavigationMenuTreeComponent } from './components/navigation-menu-tree/navigation-menu-tree.component';
import {DragulaModule} from 'ng2-dragula';

@NgModule({
  declarations: [
    NavigationMenuPageComponent,
    NavigationMenuTemplatesComponent,
    NavigationMenuTreeComponent,
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
  ],
})
export class NavigationMenuModule {}
