export class EntityItemModel {
  name: string;
  description: string;
  entityItemUId: string;
  workflowState: string;
  displayIndex: number;
  tempId?: number;

  constructor(name?: string) {
    this.name = name;
  }
}
