export class AdvEntitySearchableItemModel {
  name: string;
  description: string;
  entityItemUId: string;
  workflowState: string;

  constructor(name?: string) {
    this.name = name;
  }
}
