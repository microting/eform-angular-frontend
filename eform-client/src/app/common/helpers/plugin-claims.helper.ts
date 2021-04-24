import { snakeToCamel } from './snake-to-camel.helper';
import { AuthState } from 'src/app/common/store';

export class PluginClaimsHelper {
  public static check(claimName: string): boolean {
    const user: any = JSON.parse(localStorage.getItem('mainStore'));
    const userClaims = user.auth.currentUser.claims;
    const normalizedClaimName = snakeToCamel(claimName);
    return (
      userClaims.hasOwnProperty(normalizedClaimName) &&
      userClaims[normalizedClaimName] === 'True'
    );
  }
}
