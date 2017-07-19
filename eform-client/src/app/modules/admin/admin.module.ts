import {HelpersModule} from '../helpers/helpers.module';
import {FormsModule} from '@angular/forms';
import {AdminRoutingModule} from './admin-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';
import {AdminComponent} from './components/admin.component';
import {UserGridComponent} from 'app/modules/admin/components/user-grid/user-grid.component';
import {UserComponent} from 'app/modules/admin/components/user/user.component';
import {UserPaginationComponent} from 'app/modules/admin/components/user-pagination/user-pagination.component';
import {UserEditComponent} from 'app/modules/admin/components/user-edit/user-edit.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    TooltipModule.forRoot(),
    Ng2Bs3ModalModule,
    HelpersModule
  ],
  declarations: [
    AdminComponent,
    UserGridComponent,
    UserComponent,
    UserPaginationComponent,
    UserEditComponent
  ],
})
export class AdminModule {
}
