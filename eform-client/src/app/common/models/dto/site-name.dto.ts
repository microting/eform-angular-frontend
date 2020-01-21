import {KeyValueModel} from '../common';

export class SiteNameDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  siteName: string;
  siteUId: number;
  tags: Array<KeyValueModel> = [];
}
