import {ConnectionStringMainModel} from 'app/models/settings/connection-string-main';
import {ConnectionStringSDKModel} from 'app/models/settings/connection-string-sdk';

export class SettingsModel {
  connectionStringMain: ConnectionStringMainModel = new ConnectionStringMainModel;
  connectionStringSDK: ConnectionStringSDKModel = new ConnectionStringSDKModel;
}
