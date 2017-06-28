export class AdvEntityItemModel {
  name: string;
  description: string;
  entityItemUId: string;
  workflowState: string;

  constructor(name?: string) {
    this.name = name;
  }
}
