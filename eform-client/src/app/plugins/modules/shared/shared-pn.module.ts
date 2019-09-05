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
  SubheaderPnComponent,
  ComboChartPnComponent,
  ComboSeriesVerticalComponent
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
    SpinnerPnComponent,
    PaginationPnComponent,
    SubheaderPnComponent,
    PellPnComponent,
    PageSizePnComponent,
    ComboChartPnComponent,
    ComboSeriesVerticalComponent],
  exports: [SpinnerPnComponent, PaginationPnComponent, SubheaderPnComponent, PellPnComponent, PageSizePnComponent, ComboChartPnComponent],
  providers: [SharedPnService]
})
export class SharedPnModule { }
