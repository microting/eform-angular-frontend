import {KeyValueModel} from '../common';

export class SiteNameDto {
  createdAt: Date;
  updatedAt: Date;
  siteName: string;
  siteUId: number;
  tags: Array<KeyValueModel> = [];
}
