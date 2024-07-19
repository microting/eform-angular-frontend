import {environment} from '../../../environments/environment';

export const applicationLanguages: {
  id: number;
  locale: string;
  text: string;
}[] = [
  { id: 1, locale: 'da', text: 'Dansk' },
  { id: 2, locale: 'en-US', text: 'English' },
  { id: 3, locale: 'de-DE', text: 'Deutsch' },
  { id: 4, locale: 'uk-UA', text: 'Ukrainian' },
  { id: 5, locale: 'pl-PL', text: 'Polish' },
  { id: 6, locale: 'no-NO', text: 'Norwegian' },
  { id: 7, locale: 'sv-SE', text: 'Swedish' },
  { id: 8, locale: 'es-ES', text: 'Spanish' },
  { id: 9, locale: 'fr-FR', text: 'French' },
  { id: 10, locale: 'it-IT', text: 'Italian' },
  { id: 11, locale: 'nl-NL', text: 'Dutch' },
  { id: 12, locale: 'pt-BR', text: 'Brazilian Portuguese' },
  { id: 13, locale: 'pt-PT', text: 'Portuguese' },
  { id: 14, locale: 'fi-FI', text: 'Finnish' },
  { id: 15, locale: 'tr-TR', text: 'Türkçe' },
  { id: 16, locale: 'et-ET', text: 'Eesti' },
  { id: 17, locale: 'lv-LV', text: 'Latviski' },
  { id: 18, locale: 'lt-LT', text: 'Lietuvių' },
  { id: 19, locale: 'ro-RO', text: 'Română' },
  { id: 20, locale: 'bg-BG', text: 'български' },
  { id: 21, locale: 'sk-SK', text: 'Slovenský' },
  { id: 22, locale: 'sl-SL', text: 'Slovenščina' },
  { id: 23, locale: 'is-IS', text: 'Íslenska' },
  { id: 24, locale: 'cs-CZ', text: 'Čeština' },
  { id: 25, locale: 'hr-HR', text: 'Hrvatski' },
  { id: 26, locale: 'el-GR', text: 'Ελληνικά' },
  { id: 27, locale: 'hu-HU', text: 'Magyar' },
];

export const applicationLanguagesTranslated: {
  id: number;
  locale: string;
  text: string;
}[] = environment.production ? [
  { id: 1, locale: 'da', text: 'Dansk' },
  { id: 2, locale: 'en-US', text: 'English' },
  { id: 3, locale: 'de-DE', text: 'Deutsch' },
  // { id: 4, locale: 'uk-UA', text: 'Ukrainian' },
] : [
  { id: 1, locale: 'da', text: 'Dansk' },
  { id: 2, locale: 'en-US', text: 'English' },
  { id: 3, locale: 'de-DE', text: 'Deutsch' },
];


// This is here for the plugins who does not have a German implantation
export const applicationLanguages2: {
  id: number;
  locale: string;
  text: string;
}[] = applicationLanguagesTranslated.filter((x) => x.locale !== 'de-DE');

