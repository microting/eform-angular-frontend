import {
  Component,
  EventEmitter, Injectable,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {PaginationModel} from 'src/app/common/models';
import {PageEvent} from '@angular/material/paginator';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'eform-pagination',
    templateUrl: './eform-pagination.component.html',
    styleUrls: ['./eform-pagination.component.scss'],
    standalone: false
})
export class EformPaginationComponent implements OnInit, OnChanges {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() paginationChanged: EventEmitter<PaginationModel> = new EventEmitter<PaginationModel>();
  @Input() pageSizeOptions: number[] = [5, 10, 100, 1000, 100000];
  @Input() pagination: PaginationModel;

  getCurrentPage(): number {
    return Math.floor(this.pagination.offset / this.pagination.pageSize);
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnInit() {
  }

  changePage(pageEvent: PageEvent) {
    this.paginationChanged.emit({
      pageSize: pageEvent.pageSize,
      offset: pageEvent.pageIndex * pageEvent.pageSize,
      total: this.pagination.total,
    });
  }
}
