export class GoogleAuthInfoModel {
  psk: string;
  isTwoFactorEnabled: boolean;
  isTwoFactorForced: boolean;

  constructor() {
    this.isTwoFactorForced = true;
  }
}
