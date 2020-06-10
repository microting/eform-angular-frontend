import {snakeToCamel} from './snake-to-camel.helper';

export class PluginClaimsHelper {
  public static check(claimName: string): boolean {
    const userClaims = JSON.parse(localStorage.getItem('userClaims'));
    const normalizedClaimName = snakeToCamel(claimName);
    return userClaims.hasOwnProperty(normalizedClaimName) && userClaims[normalizedClaimName] === 'True';
  }
}
