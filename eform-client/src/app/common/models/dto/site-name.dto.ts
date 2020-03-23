import {KeyValueModel} from '../common';
import {UnitModel} from './unit-model';

export class SiteNameDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  siteName: string;
  siteUId: number;
  tags: Array<KeyValueModel> = [];
  units: Array<UnitModel> = [];
}
