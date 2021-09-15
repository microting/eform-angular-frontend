import { applicationLanguages } from 'src/app/common/const';
import { CommonTranslationsModel } from 'src/app/common/models';

export function fixTranslations(
  translations: CommonTranslationsModel[]
): CommonTranslationsModel[] {
  if (translations.length < applicationLanguages.length) {
    for (const language of applicationLanguages) {
      if (!translations.find((x) => x.languageId === language.id)) {
        translations = [
          ...translations,
          {
            id: null,
            languageId: language.id,
            description: '',
            name: '',
          },
        ];
      }
    }
  }
  return translations;
}
