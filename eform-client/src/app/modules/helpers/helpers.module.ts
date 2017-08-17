import {SpinnerComponent, SwitchComponent} from './components';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DndModule} from 'ng2-dnd';

export * from './components'
export * from './app.constants'
export * from './operation.models'
export * from './galery-config'

@NgModule({
  imports: [
    CommonModule,
    DndModule
  ],
  declarations: [
    SpinnerComponent,
    SwitchComponent
  ],
  exports: [SpinnerComponent, DndModule, SwitchComponent]
})
export class HelpersModule {
}
