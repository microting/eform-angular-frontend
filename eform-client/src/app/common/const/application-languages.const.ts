import {environment} from '../../../environments/environment';

export const applicationLanguages: {
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
  // { id: 4, locale: 'uk-UA', text: 'Ukrainian' },
  // { id: 5, locale: 'pl-PL', text: 'Polish' },
  // { id: 6, locale: 'no-NO', text: 'Norwegian' },
  // { id: 7, locale: 'sv-SE', text: 'Swedish' },
  // { id: 8, locale: 'es-ES', text: 'Spanish' },
  // { id: 9, locale: 'fr-FR', text: 'French' },
  // { id: 10, locale: 'it-IT', text: 'Italian' },
  // { id: 11, locale: 'nl-NL', text: 'Dutch' },
  // { id: 12, locale: 'pt-BR', text: 'Brazilian Portuguese' },
  // { id: 13, locale: 'pt-PT', text: 'Portuguese' },
  // { id: 14, locale: 'fi-FI', text: 'Finnish' },
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

