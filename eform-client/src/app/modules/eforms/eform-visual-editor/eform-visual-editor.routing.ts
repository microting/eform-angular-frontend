import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard, IsAuthGuard} from 'src/app/common/guards';
import { EformVisualEditorContainerComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    canActivate: [IsAuthGuard],
    component: EformVisualEditorContainerComponent,
  },
  {
    path: ':templateId',
    canActivate: [IsAuthGuard],
    component: EformVisualEditorContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EformVisualEditorRouting {}
