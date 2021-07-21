import { EformVisualEditorFieldModel, EformVisualEditorModel } from './';

export class EformVisualEditorUpdateModel {
  // checklist ids for delete
  checklistForDelete: number[] = [];
  // checklist models for create
  checklistForCreate: EformVisualEditorModel[] = [];
  // field ids for delete
  fieldForDelete: number[] = [];
  // field models for create
  fieldForCreate: EformVisualEditorFieldModel[] = [];
  // field models for update
  fieldForUpdate: EformVisualEditorFieldModel[] = [];
  // parent checklist
  checklist: EformVisualEditorModel = new EformVisualEditorModel();
  // checklist models for update
  checklistForUpdate: EformVisualEditorModel[] = [];
}
