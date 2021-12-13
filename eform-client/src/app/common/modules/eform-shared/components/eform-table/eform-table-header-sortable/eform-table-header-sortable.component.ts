import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[table-header-sortable]',
  templateUrl: './eform-table-header-sortable.component.html',
  styleUrls: ['./eform-table-header-sortable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EformTableHeaderSortableComponent implements OnInit {
  @Input() name: string;
  @Input() visibleName: string;
  @Input() isSortDsc: boolean;
  @Input() currentSortName: string;
  @Input() translateName = true;
  @Input() elementId: string;
  @Output() sortClick: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  handleKeyDown() {
    this.sortClick.emit(this.name);
  }

  constructor() {}

  ngOnInit(): void {}
}
