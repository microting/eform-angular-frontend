export class CustomerPnFullModel {
  id: number;
  createdBy: string;
  companyName: string;
  companyAddress: string;
  companyAddress2: string;
  customerNo: string;
  zipCode: string;
  cityName: string;
  phone: string;
  email: string;
  contactPerson: string;
  description: string = null;
  relatedEntityId: string;
  eanCode: string;
  vatNumber: string;
  countryCode: string;
  crmId: number;
  cadastralNumber: string;
  propertyNumber: number;
  apartmentNumber: number;
  completionYear: number;
  floorsWithLivingSpace: number;
}
