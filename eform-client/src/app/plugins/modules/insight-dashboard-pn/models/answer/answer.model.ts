export class AnswerModel {
  id: number;
  microtingUid: number;
  finishedAt: dateFns;
  answerDuration: number;
  siteName: string;
  unitId: number;  answerValues: AnswerValuesModel[] = [];
}

export class AnswerValuesModel {
  id: number;
  value: string;
  translations: AnswerValueTranslationModel[];
  question: string;
}

export class AnswerValueTranslationModel {
  languageId: number;
  languageName: string;
  value: string;
}
