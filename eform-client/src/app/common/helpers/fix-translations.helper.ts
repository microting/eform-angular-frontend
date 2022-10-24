import { applicationLanguages } from 'src/app/common/const';
import { CommonTranslationsModel } from 'src/app/common/models';

/**
 * Fixes translations of objects.
 * If the translation is not in this list, but such a locale is in the list of all locales, this script adds it with empty values.
 * @param translations A list with a potentially incomplete list of translations
 * @returns List with all the locales that is in the application.
 */
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
