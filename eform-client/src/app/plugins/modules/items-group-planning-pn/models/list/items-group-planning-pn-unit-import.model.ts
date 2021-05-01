import {ItemsGroupPlanningPnHeadersModel} from './items-group-planning-pn-headers.model';

export class ItemsGroupPlanningPnUnitImportModel {
  importList: string;
  headerList: Array<ItemsGroupPlanningPnHeadersModel> = [];
  headers: string;
}
