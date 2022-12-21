export class DeleteModalSettingModel {
  model: any;
  settings: {
    headerText: string,
    fields: {
      field: string,
      header: string,
      type?: 'date' | 'dateTime' | 'text',
      /** for type == date or dateTime; if date - format for date pipe; if datetime - format set date-formatter **/
      format?: string,
      /** for type == text; displayed this text **/
      text?: string,
    }[];
    deleteButtonText?: string;
    cancelButtonText?: string;
    deleteButtonId?: string;
    cancelButtonId?: string;
    // delete?: (model: any) => void;
  };
}
