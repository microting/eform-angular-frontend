import {TranslateModule} from '@ngx-translate/core';
import {UserSettingsComponent} from 'app/modules/account-management/components/user-settings/user-settings.component';
import {NgxSelectModule} from 'ngx-select-ex';
import {HelpersModule} from '../helpers/helpers.module';
import {FormsModule} from '@angular/forms';
import {AccountManagementRoutingModule} from './account-management-routing.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TooltipModule} from 'ngx-bootstrap';
import {AdminComponent} from './components/admin.component';
import {UserGridComponent} from './components/user-grid/user-grid.component';
import {UserComponent} from './components/user/user.component';
import {UserPaginationComponent} from './components/user-pagination/user-pagination.component';
import {UserEditComponent} from './components/user-edit/user-edit.component';
import {ChangePasswordComponent} from './components/change-password/change-password.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AccountManagementRoutingModule,
    TooltipModule,
    TranslateModule,
    NgxSelectModule,
    Ng2Bs3ModalModule,
    HelpersModule
  ],
  declarations: [
    AdminComponent,
    UserGridComponent,
    ChangePasswordComponent,
    UserComponent,
    UserPaginationComponent,
    UserEditComponent,
    UserSettingsComponent
  ],
})
export class AccountManagementModule {
}
