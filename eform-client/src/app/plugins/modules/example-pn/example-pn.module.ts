import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExamplePnMainService} from './services';
import {ExamplePnPageComponent} from './components';
import {ExamplePnRoutingModule} from './example-pn.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ExamplePnRoutingModule
  ],
  declarations: [ExamplePnPageComponent],
  providers: [ExamplePnMainService]
})
export class ExamplePnModule { }
