import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AuthService } from 'src/app/common/services';
import { EformDocxReportItemModel } from 'src/app/common/models';

@Component({
  selector: 'app-eform-docx-report-table',
  templateUrl: './eform-docx-report-table.component.html',
  styleUrls: ['./eform-docx-report-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EformDocxReportTableComponent implements OnInit {
  @Input() items: EformDocxReportItemModel[] = [];
  @Input() dateFrom: any;
  @Input() dateTo: any;
  @Input() itemHeaders: { key: string; value: string }[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
