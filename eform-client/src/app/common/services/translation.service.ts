import { Injectable, inject } from '@angular/core';
import {ApiBaseService} from 'src/app/common/services/apiBase.service';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult} from 'src/app/common/models';

const TranslationServiceMethods = {
  getTranslation: 'api/get-translation',
  translationPossible: 'api/translation-possible',
};

export class TranslationRequestModel {
  sourceText: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;

  constructor(data?: Partial<TranslationRequestModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class TranslationModel {
  translation: string;
}

@Injectable({
  providedIn: 'root',
})

export class TranslationService {
  private apiBaseService = inject(ApiBaseService);


  getTranslation(
    model: TranslationRequestModel
  ): Observable<OperationDataResult<string>> {
    return this.apiBaseService.get<string>(
      TranslationServiceMethods.getTranslation,
      {
        sourceText: model.sourceText,
        sourceLanguageCode: model.sourceLanguageCode,
        targetLanguageCode: model.targetLanguageCode,
      }
    );
  }

  translationPossible(): Observable<OperationDataResult<boolean>> {
    return this.apiBaseService.get<boolean>(
      TranslationServiceMethods.translationPossible
    );
  }
}
