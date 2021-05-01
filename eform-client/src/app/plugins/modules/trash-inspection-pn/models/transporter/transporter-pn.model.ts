export class TransportersPnModel {
  total: number;
  transporterList: Array<TransporterPnModel> = [];
}

export class TransporterPnModel {
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
