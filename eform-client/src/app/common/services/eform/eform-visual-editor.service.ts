import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  CommonDictionaryModel,
  DeployModel,
  EFormCreateModel,
  EformDownloadExcelModel,
  EformVisualEditorModel,
  FieldDto,
  OperationDataResult,
  OperationResult,
  TemplateColumnModel,
  TemplateDto,
  TemplateListModel,
  TemplateRequestModel,
  UpdateColumnsModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const TemplateVisualEditorMethods = {
  VisualEditor: '/api/template-visual-editor/',
};

@Injectable({
  providedIn: 'root',
})
export class EformVisualEditorService {
  public collapse: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(private apiBaseService: ApiBaseService) {}

  updateState(collapsed: boolean): void {
    this.collapse.next(collapsed);
  }

  getVisualEditorTemplate(
    id: number
  ): Observable<OperationDataResult<EformVisualEditorModel>> {
    return this.apiBaseService.get(
      `${TemplateVisualEditorMethods.VisualEditor}${id}`
    );
  }

  createVisualEditorTemplate(
    model: EformVisualEditorModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(
      TemplateVisualEditorMethods.VisualEditor,
      model
    );
  }

  updateVisualEditorTemplate(
    model: EformVisualEditorModel
  ): Observable<OperationResult> {
    return this.apiBaseService.put(
      TemplateVisualEditorMethods.VisualEditor,
      model
    );
  }
}
