export class UnitDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  siteId: number;
  siteMicrotingUid: number;
  siteName: string;
  microtingUid: number;
  customerNo: number;
  otpCode: number;
  manufacturer: string;
  model: string;
  note: string;
  os: string;
  osVersion: string;
  eFormVersion: string;
  inSightVersion: string;
  eFormVersionHealth: string;
  inSightVersionHealth: string;
  syncDialog: boolean;
  syncDelayEnabled: boolean;
  syncDefaultDelay: number;
  syncDelayPrCheckList: number;
  pushEnabled: boolean;
  isLocked: boolean;
}
