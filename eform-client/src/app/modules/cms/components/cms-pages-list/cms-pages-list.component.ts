import {Component, OnInit, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CmsPageListModel} from 'src/app/common/models';
import {CmsService} from 'src/app/common/services/cms';
import {DatePipe, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
} from '@angular/material/table';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  imports: [NgIf, DatePipe, MatButton, MatIconButton, MatIcon, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTooltip],
  selector: 'app-cms-pages-list',
  templateUrl: './cms-pages-list.component.html',
})
export class CmsPagesListComponent implements OnInit {
  private cmsService = inject(CmsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  pages: CmsPageListModel[] = [];
  displayedColumns = ['title', 'slug', 'isLandingPage', 'isPublished', 'updatedAt', 'actions'];

  ngOnInit(): void {
    this.loadPages();
  }

  loadPages(): void {
    this.cmsService.getAllPages().subscribe((result) => {
      if (result.success) this.pages = result.model;
    });
  }

  editPage(id: number): void {
    this.router.navigate(['/cms/pages', id]);
  }

  newPage(): void {
    this.router.navigate(['/cms/pages/new']);
  }

  deletePage(id: number): void {
    if (!confirm('Delete this page?')) return;
    this.cmsService.deletePage(id).subscribe((result) => {
      if (result.success) {
        this.toastr.success('Page deleted');
        this.loadPages();
      } else {
        this.toastr.error(result.message);
      }
    });
  }
}
