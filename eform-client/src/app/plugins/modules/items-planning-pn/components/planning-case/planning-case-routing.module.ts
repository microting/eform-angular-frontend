import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PlanningCasePageComponent} from 'src/app/plugins/modules/items-planning-pn/components/planning-case/planning-case-page/planning-case-page.component';

const routes: Routes = [
  {path: ':sdkCaseId/:templateId/:planningId/:dateFrom/:dateTo', component: PlanningCasePageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningCaseRoutingModule { }
