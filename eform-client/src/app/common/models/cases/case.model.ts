export class CaseModel {
  id: number;
  createdAt: Date;
  doneAt: Date;
  doneAtUserModifiable: Date;
  workerName: string;
  status: number;

  fieldValue1: string;
  fieldValue2: string;
  fieldValue3: string;
  fieldValue4: string;
  fieldValue5: string;
  fieldValue6: string;
  fieldValue7: string;
  fieldValue8: string;
  fieldValue9: string;
  fieldValue10: string;
  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.createdAt = data.createdAt;
      this.doneAt = data.doneAt;
      this.workerName = data.workerName;
      this.status = data.status;
      this.fieldValue1 = data.fieldValue1;
      this.fieldValue2 = data.fieldValue2;
      this.fieldValue3 = data.fieldValue3;
      this.fieldValue4 = data.fieldValue4;
      this.fieldValue5 = data.fieldValue5;
      this.fieldValue6 = data.fieldValue6;
      this.fieldValue7 = data.fieldValue7;
      this.fieldValue8 = data.fieldValue8;
      this.fieldValue9 = data.fieldValue9;
      this.fieldValue10 = data.fieldValue10;
    }
  }
}
