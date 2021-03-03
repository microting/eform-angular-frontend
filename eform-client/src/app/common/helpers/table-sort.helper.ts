import { PageSettingsModel } from 'src/app/common/models';

export const sortTable = (
  sort: string,
  currentPageSettings: PageSettingsModel
) => {
  let updatedPageSettings;
  if (currentPageSettings.sort === sort) {
    updatedPageSettings = {
      ...currentPageSettings,
      isSortDsc: !currentPageSettings.sort,
    };
  } else {
    updatedPageSettings = { ...currentPageSettings, isSortDsc: false };
    updatedPageSettings = { ...currentPageSettings, sort };
  }
  return updatedPageSettings;
};
