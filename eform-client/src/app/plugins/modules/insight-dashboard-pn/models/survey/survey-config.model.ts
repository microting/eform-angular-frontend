import {CommonDictionaryModel} from '../../../../../common/models/common';

export class SurveyConfigModel {
  id: number;
  surveyName: string;
  surveyId: number;
  locations: CommonDictionaryModel[];
  isActive: boolean;
}
