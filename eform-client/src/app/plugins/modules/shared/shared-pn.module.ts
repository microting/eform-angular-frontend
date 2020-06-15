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
import {LoaderInterceptor} from 'src/app/common/interceptors/loader-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpErrorInterceptor, JwtInterceptor} from 'src/app/common/interceptors';

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
  providers: [
    SharedPnService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
    // TODO 5th May 2020: the above line is not suppose to be here, for some reason some plugins will not work without this line.
    ]
})
export class SharedPnModule { }
