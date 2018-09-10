import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {PaginationPnComponent, PellPnComponent, SpinnerPnComponent, SubheaderPnComponent} from './components';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [SpinnerPnComponent, PaginationPnComponent, SubheaderPnComponent, PellPnComponent],
  exports: [SpinnerPnComponent, PaginationPnComponent, SubheaderPnComponent, PellPnComponent]
})
export class SharedPnModule { }
