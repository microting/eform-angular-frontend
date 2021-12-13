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
})
export class EformTableHeadersComponent implements OnInit {
  @Input() sort: SortModel;
  @Input() isSortDsc: boolean;
  @Input() currentSortName: string;
  @Output() sortChanged: EventEmitter<string> = new EventEmitter<string>();
  @Input() tableHeaders: TableHeaderElementModel[] = [];
  @Input() customCell: TemplateRef<any>;
  @Input() stickyHeader = false;
  constructor() {}

  ngOnInit(): void {}

  onSortClick(name: string) {
    this.sortChanged.emit(name);
  }

  getElementId(name: string): string {
    if (name) {
      const firstSymbol = name.split('')[0];
      name = name.replace(firstSymbol, firstSymbol.toLowerCase());
      return `${name}TableHeader`;
    }
  }
}
