import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Observable, range } from 'rxjs';
import { filter, map, toArray } from 'rxjs/operators';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'pagination-pn',
    templateUrl: './pagination-pn.component.html',
    styleUrls: ['./pagination-pn.component.scss'],
    standalone: false
})
export class PaginationPnComponent implements OnInit, OnChanges {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onPageChanged: EventEmitter<number> = new EventEmitter<number>();
  @Input() offset = 0;
  @Input() limit = 1;
  @Input() size = 1;
  @Input() range = 3;
  currentPage: number;
  totalPages: number;
  pages: Observable<number[]>;

  selectPage(page: number) {
    if (this.isValidPageNumber(page, this.totalPages)) {
      this.onPageChanged.emit((page - 1) * this.limit);
    } else {
      return;
    }
  }

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, size);
    this.pages = range(-this.range, this.range * 2 + 1).pipe(
      map((offsetLocal) => this.currentPage + offsetLocal),
      filter((page) => this.isValidPageNumber(page, this.totalPages)),
      toArray()
    );
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.size);
  }

  ngOnInit() {
    this.getPages(this.offset, this.limit, this.size);
  }
}
