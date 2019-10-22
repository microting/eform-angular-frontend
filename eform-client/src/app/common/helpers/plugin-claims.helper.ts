import {JwtHelper} from './jwt.helper';

export class PluginClaimsHelper {
  public static check(claimName: string): boolean {
    const accessToken = JSON.parse(localStorage.getItem('currentAuth')).access_token;
    const decodedToken = new JwtHelper().decodeToken(accessToken);

    return decodedToken.hasOwnProperty(claimName) && decodedToken[claimName] === 'True';
  }
}
