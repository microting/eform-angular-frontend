import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SimpleSitesRoutingModule} from './simple-sites-routing.module';
import {SimpleSitesComponent} from './components/simple-sites.component';
import {SimpleSitesTableComponent} from './components/simple-sites-table/simple-sites-table.component';
import {SimpleSitesService} from 'app/services/simple-sites.service';
import {SimpleSiteEditComponent} from './components/simple-site-edit/simple-site-edit.component';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'ngx-bootstrap';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {HelpersModule} from '../helpers/helpers.module';
import {UnitsService} from 'app/services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule.forRoot(),
    Ng2Bs3ModalModule,
    HelpersModule,
    SimpleSitesRoutingModule
  ],
  declarations: [
    SimpleSitesComponent,
    SimpleSitesTableComponent,
    SimpleSiteEditComponent
  ],
  providers: [SimpleSitesService, UnitsService]
})
export class SimpleSitesModule {
}
