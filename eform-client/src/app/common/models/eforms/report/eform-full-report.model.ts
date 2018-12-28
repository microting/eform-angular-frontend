import {MainElementDto} from 'src/app/common/models/dto/main-element.dto';
import {EformReportMainElement} from 'src/app/common/models/eforms/report/eform-report.element';
import {EformReportModel} from './eform-report.model';

export class EformFullReportModel {
  eformMainElement: EformReportMainElement = new EformReportMainElement();
  eformReport: EformReportModel = new EformReportModel();
}
