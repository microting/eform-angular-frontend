export const applicationLanguages: {
  id: number;
  locale: string;
  text: string;
}[] = [
  { id: 1, locale: 'da', text: 'Danish' },
  { id: 2, locale: 'en-US', text: 'English' },
  { id: 3, locale: 'de-DE', text: 'German' },
  // { id: 4, locale: 'uk-UA', text: 'Ukrainian' },
];

// This is here for the plugins who does not have a German implantation
export const applicationLanguages2: {
  id: number;
  locale: string;
  text: string;
}[] = applicationLanguages.filter((x) => x.locale !== 'de-DE');
