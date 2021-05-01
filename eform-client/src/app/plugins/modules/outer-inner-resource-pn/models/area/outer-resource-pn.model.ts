export class OuterResourcesPnModel {
  total: number;
  outerResourceList: Array<OuterResourcePnModel> = [];
  name: string;
}

export class OuterResourcePnModel {
  id: number;
  name: string;
  externalId: number;
  relatedInnerResourcesIds: Array<number> = [];
}
