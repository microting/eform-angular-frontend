import {applicationLanguages} from 'src/app/common/const';
import {CommonTranslationsModel} from 'src/app/common/models';

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

/**
 * This function ensures that there is a translation for each language.
 * If a translation for a specific language is missing, it adds a default translation for that language.
 *
 * @param {CommonTranslationsModel[]} translations - The array of translations that needs to be checked.
 * @param {{languageId: number}[]} languages - The array of languages that should be covered by translations.
 *
 * @returns {CommonTranslationsModel[]} - The updated array of translations, which now includes a translation for each language.
 */
export function fixTranslationsByLanguages(
  translations: CommonTranslationsModel[],
  languages: { languageId: number }[],
): CommonTranslationsModel[] {
  if (translations.length < languages.length) {
    for (const language of languages) {
      if (!translations.find((x) => x.languageId === language.languageId)) {
        translations = [
          ...translations,
          {
            id: null,
            languageId: language.languageId,
            description: '',
            name: '',
          },
        ];
      }
    }
  }
  return translations;
}
