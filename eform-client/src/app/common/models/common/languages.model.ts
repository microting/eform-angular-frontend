export class LanguagesModel {
  languages: Array<LanguageModel>;
}

export class LanguageModel {
  id: number;
  name: string;
  languageCode: string;
  isActive: boolean;
}
