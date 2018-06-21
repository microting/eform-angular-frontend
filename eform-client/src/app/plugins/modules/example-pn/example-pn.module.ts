import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ExamplePnMainService} from './services';
import {ExamplePnPageComponent} from './components';
import {ExamplePnRoutingModule} from './example-pn.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ExamplePnRoutingModule,
    TranslateModule
  ],
  declarations: [ExamplePnPageComponent],
  providers: [ExamplePnMainService]
})
export class ExamplePnModule { }
