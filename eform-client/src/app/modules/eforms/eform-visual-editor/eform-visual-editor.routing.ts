import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';
import { EformVisualEditorContainerComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: EformVisualEditorContainerComponent,
  },
  {
    path: ':templateId',
    canActivate: [AuthGuard],
    component: EformVisualEditorContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EformVisualEditorRouting {}
