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
  SubheaderPnComponent
} from './components';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    NgxChartsModule
  ],
  declarations: [
    PaginationPnComponent,
    SubheaderPnComponent,
    PellPnComponent,
    PageSizePnComponent],
  exports: [PaginationPnComponent, SubheaderPnComponent, PellPnComponent, PageSizePnComponent],
  providers: [SharedPnService]
})
export class SharedPnModule { }
