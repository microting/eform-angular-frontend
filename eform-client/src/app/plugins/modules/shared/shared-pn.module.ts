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
import {NgxChartsModule} from '@microting/ngx-charts';
import { BarChartPnComponent } from './components/bar-chart-pn/bar-chart-pn.component';

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
    ComboSeriesVerticalComponent,
    BarChartPnComponent],
  exports: [SpinnerPnComponent, PaginationPnComponent, SubheaderPnComponent, PellPnComponent, PageSizePnComponent, ComboChartPnComponent, BarChartPnComponent],
  providers: [SharedPnService]
})
export class SharedPnModule { }
