export class ProducersPnModel {
  total: number;
  producerList: Array<ProducerPnModel> = [];
}

export class ProducerPnModel {
  id: number;
  name: string;
  description: string;
  foreignId: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  contactPerson: string;
}
