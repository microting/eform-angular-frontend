import {Component, Input, OnDestroy} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {TemplateFilesService} from 'src/app/common/services';
import {Subscription} from 'rxjs';

@AutoUnsubscribe()
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'element-pdf',
    templateUrl: './element-pdf.component.html',
    styleUrls: ['./element-pdf.component.scss'],
    standalone: false
})
export class ElementPdfComponent implements OnDestroy {
  dataItemObj: DataItemDto = new DataItemDto();
  pdfSub$: Subscription;

  @Input()
  get dataItem() {
    return this.dataItem;
  }

  set dataItem(val) {
    this.dataItemObj = val;
  }

  constructor(private templateFilesService: TemplateFilesService) {
  }

  ngOnDestroy(): void {
  }

  getPdf(fileName: string) {
    // TODO: CHECK
    this.pdfSub$ = this.templateFilesService.getPdfFile(fileName).subscribe((blob) => {
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    });
  }
}
