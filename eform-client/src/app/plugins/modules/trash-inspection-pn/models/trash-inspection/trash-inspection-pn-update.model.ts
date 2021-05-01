export class TrashInspectionPnUpdateModel {
  id: number;
  name: string;
  relatedAreasIds: Array<number> = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.relatedAreasIds = data.relatedAreasIds;
    }
  }
}
