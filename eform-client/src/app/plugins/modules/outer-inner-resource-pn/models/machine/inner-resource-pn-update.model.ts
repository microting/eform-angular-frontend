export class InnerResourcePnUpdateModel {
  id: number;
  name: string;
  externalId: number;
  relatedOuterResourcesIds: Array<number> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.externalId = data.externalId;
      this.relatedOuterResourcesIds = data.relatedOuterResourcesIds;
    }
  }
}
