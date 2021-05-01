export class ProducerPnUpdateModel {
  id: number;
  name: string;
  description: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
    }
  }
}
