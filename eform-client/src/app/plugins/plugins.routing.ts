import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/common/guards';

export const routes: Routes = [
{
path: "trash-inspection-pn",
canActivate: [AuthGuard],
loadChildren: "./modules/trash-inspection-pn/trash-inspection-pn.module#TrashInspectionPnModule"
}
// INSERT ROUTES HERE
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRouting {
}
