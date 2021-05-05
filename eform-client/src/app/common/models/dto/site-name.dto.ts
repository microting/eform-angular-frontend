import { UnitModel } from './unit-model';

export class SiteNameDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  siteName: string;
  siteUId: number;
  tags: Array<number> = [];
  units: Array<UnitModel> = [];
}
