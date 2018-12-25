import {MainElementDto} from 'src/app/common/models/dto/main-element.dto';
import {EformReportModel} from './eform-report.model';

export class EformFullReportModel {
  eformMainElement: MainElementDto = new MainElementDto();
  eformReport: EformReportModel = new EformReportModel();
}
