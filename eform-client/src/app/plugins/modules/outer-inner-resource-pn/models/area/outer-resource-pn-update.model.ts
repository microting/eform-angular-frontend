export class OuterResourcePnUpdateModel {
  id: number;
  name: string;
  externalId: number;
  relatedInnerResourcesIds: Array<number> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.externalId = data.externalId;
      this.relatedInnerResourcesIds = data.relatedInnerResourcesIds;
    }
  }
}
