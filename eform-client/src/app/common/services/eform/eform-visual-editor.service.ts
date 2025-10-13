import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EformVisualEditorModel,
  EformVisualEditorUpdateModel,
  OperationDataResult,
  OperationResult,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const TemplateVisualEditorMethods = {
  VisualEditor: '/api/template-visual-editor/',
};

@Injectable({
  providedIn: 'root',
})
export class EformVisualEditorService {
  private apiBaseService = inject(ApiBaseService);


  getVisualEditorTemplate(
    id: number
  ): Observable<OperationDataResult<EformVisualEditorModel>> {
    return this.apiBaseService.get(TemplateVisualEditorMethods.VisualEditor, {
      id: id,
    });
  }

  createVisualEditorTemplate(
    model: EformVisualEditorModel
  ): Observable<OperationResult> {
    return this.apiBaseService.postFormData(
      TemplateVisualEditorMethods.VisualEditor,
      model
    );
  }

  updateVisualEditorTemplate(
    model: EformVisualEditorUpdateModel
  ): Observable<OperationResult> {
    return this.apiBaseService.putFormData(
      TemplateVisualEditorMethods.VisualEditor,
      model
    );
  }
}
