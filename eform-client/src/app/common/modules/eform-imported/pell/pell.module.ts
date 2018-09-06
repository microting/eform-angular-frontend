import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PellComponent } from './pell.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PellComponent],
  exports: [PellComponent]
})
export class PellModule { }
