import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { SortModel, TableHeaderElementModel } from 'src/app/common/models';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[table-headers]',
    templateUrl: './eform-table-headers.component.html',
    styleUrls: ['./eform-table-headers.component.scss'],
    standalone: false
})
export class EformTableHeadersComponent implements OnInit {
  // todo need to remove from this line to end
  @Input() sort: SortModel;
  @Input() isSortDsc: boolean;
  @Input() currentSortName: string;
  @Output() sortChanged: EventEmitter<string> = new EventEmitter<string>();
  // todo end
  @Input() tableHeaders: TableHeaderElementModel[] = [];
  @Input() customCell: TemplateRef<any>;
  @Input() stickyHeader = false;
  @Input() needTranslateHeader = true;
  constructor() {}

  ngOnInit(): void {}

  getElementId(name: string): string {
    if (name) {
      const firstSymbol = name.split('')[0];
      name = name.replace(firstSymbol, firstSymbol.toLowerCase());
      return `${name}TableHeader`;
    }
  }
}
