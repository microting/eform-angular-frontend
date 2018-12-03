import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslateModule} from '@ngx-translate/core';
import {SharedPnService} from 'src/app/plugins/modules/shared/services';
import {
  PageSizePnComponent,
  PaginationPnComponent,
  PellPnComponent,
  SpinnerPnComponent,
  SubheaderPnComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule
  ],
  declarations: [SpinnerPnComponent, PaginationPnComponent, SubheaderPnComponent, PellPnComponent, PageSizePnComponent],
  exports: [SpinnerPnComponent, PaginationPnComponent, SubheaderPnComponent, PellPnComponent, PageSizePnComponent],
  providers: [SharedPnService]
})
export class SharedPnModule { }
