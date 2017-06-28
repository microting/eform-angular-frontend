import {NotifyService} from './services/notify.service';
import {SpinnerComponent, SwitchComponent} from './components';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DndModule} from 'ng2-dnd';

export * from './services/notify.service'
export * from './components'
export * from './app.constants'
export * from './operation.models'

@NgModule({
  imports: [
    CommonModule,
    DndModule
  ],
  declarations: [
    SpinnerComponent,
    SwitchComponent
  ],
  exports: [SpinnerComponent, DndModule, SwitchComponent],
  providers: [NotifyService]
})
export class HelpersModule {
}
