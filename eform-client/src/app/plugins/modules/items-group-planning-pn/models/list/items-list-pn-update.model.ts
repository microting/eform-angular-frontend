import {ItemsListPnItemModel} from './items-list-pn-item.model';
import {Moment} from 'moment';

export class ItemsListPnUpdateModel {
  id: number;
  name: string;
  description: string;
  repeatEvery: number;
  repeatType: number;
  dayOfWeek: number;
  dayOfMonth: number;
  repeatUntil: Moment | null;
  relatedEFormId: number;
  deployedAtEnabled: boolean;
  doneAtEnabled: boolean;
  doneByUserNameEnabled: boolean;
  uploadedDataEnabled: boolean;
  labelEnabled: boolean;
  descriptionEnabled: boolean;
  itemNumberEnabled: boolean;
  locationCodeEnabled: boolean;
  buildYearEnabled: boolean;
  typeEnabled: boolean;
  numberOfImagesEnabled: boolean;
  sdkFieldId1: number;
  sdkFieldId2: number;
  sdkFieldId3: number;
  sdkFieldId4: number;
  sdkFieldId5: number;
  sdkFieldId6: number;
  sdkFieldId7: number;
  sdkFieldId8: number;
  sdkFieldId9: number;
  sdkFieldId10: number;
  items: ItemsListPnItemModel[] = [];

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.description = data.description;
      this.repeatEvery = data.repeatEvery;
      this.repeatType = data.repeatType;
      this.dayOfWeek = data.dayOfWeek;
      this.dayOfMonth = data.dayOfMonth;
      this.repeatUntil = data.repeatUntil;
      this.relatedEFormId = data.relatedEFormId;
      this.items = data.items;
      this.doneAtEnabled = data.doneAtEnabled;
      this.deployedAtEnabled = data.deployedAtEnabled;
      this.doneByUserNameEnabled = data.doneByUserNameEnabled;
      this.uploadedDataEnabled = data.uploadedDataEnabled;
      this.labelEnabled = data.labelEnabled;
      this.descriptionEnabled = data.descriptionEnabled;
      this.itemNumberEnabled = data.itemNumberEnabled;
      this.locationCodeEnabled = data.locationCodeEnabled;
      this.buildYearEnabled = data.buildYearEnabled;
      this.typeEnabled = data.typeEnabled;
      this.numberOfImagesEnabled = data.numberOfImagesEnabled;
      this.sdkFieldId1 = data.sdkFieldId1;
      this.sdkFieldId2 = data.sdkFieldId2;
      this.sdkFieldId3 = data.sdkFieldId3;
      this.sdkFieldId4 = data.sdkFieldId4;
      this.sdkFieldId5 = data.sdkFieldId5;
      this.sdkFieldId6 = data.sdkFieldId6;
      this.sdkFieldId7 = data.sdkFieldId7;
      this.sdkFieldId8 = data.sdkFieldId8;
      this.sdkFieldId9 = data.sdkFieldId9;
      this.sdkFieldId10 = data.sdkFieldId10;
    }
  }
}
