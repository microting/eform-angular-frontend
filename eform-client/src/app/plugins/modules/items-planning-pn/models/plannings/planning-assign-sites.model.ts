export class PlanningAssignSitesModel {
  planningId: number;
  assignments: PlanningAssignmentSiteModel[] = [];
}

export class PlanningAssignmentSiteModel {
  siteId: number;
  isChecked: boolean;
}
