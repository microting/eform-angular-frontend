import {UserClaimsModel} from 'src/app/common/models';
import {snakeToCamel} from './snake-to-camel.helper';

export const normalizeUserClaimNames = (rawUserClaims: { [key: string]: string }) => {
  let normalizedDictionary = {};
  for (const [key, value] of Object.entries(rawUserClaims)) {
    normalizedDictionary = {...normalizedDictionary, [snakeToCamel(key)]: value};
  }
  return normalizedDictionary as UserClaimsModel;
};
