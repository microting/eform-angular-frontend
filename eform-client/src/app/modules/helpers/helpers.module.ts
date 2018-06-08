import {TranslateModule} from '@ngx-translate/core';
import {SpinnerComponent, SwitchComponent, TablePaginationComponent} from './components';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DndModule} from 'ng2-dnd';


export * from './components'
export * from './app.constants'
export * from './operation.models'

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    DndModule
  ],
  declarations: [
    SpinnerComponent,
    SwitchComponent,
    TablePaginationComponent
  ],
  exports: [SpinnerComponent, DndModule, SwitchComponent, TablePaginationComponent]
})
export class HelpersModule {
}
