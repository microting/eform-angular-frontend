import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ToastrService} from 'ngx-toastr';
import {CmsMenuModel, CmsPageListModel, CmsMenuItemSaveModel} from 'src/app/common/models';
import {CmsService} from 'src/app/common/services/cms';
import {CmsMenuItemDialogComponent} from './cms-menu-item-dialog.component';

export interface FlatMenuItem extends CmsMenuItemSaveModel {
  indentLevel: number;
}

@Component({
  standalone: false,
  selector: 'app-cms-menu-edit',
  templateUrl: './cms-menu-edit.component.html',
  styleUrls: ['./cms-menu-edit.component.scss'],
})
export class CmsMenuEditComponent implements OnInit {
  private cmsService = inject(CmsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);

  menuId!: number;
  menu: CmsMenuModel | null = null;
  pages: CmsPageListModel[] = [];

  /** Flat list with indentLevel (0 = top, 1 = child, 2 = grandchild) */
  flatItems: FlatMenuItem[] = [];

  ngOnInit(): void {
    this.menuId = +this.route.snapshot.paramMap.get('id')!;
    this.cmsService.getMenu(this.menuId).subscribe((result) => {
      if (result.success) {
        this.menu = result.model;
        this.flatItems = this.flattenTree(result.model.items);
      }
    });
    this.cmsService.getAllPages().subscribe((result) => {
      if (result.success) this.pages = result.model;
    });
  }

  flattenTree(items: any[], level = 0): FlatMenuItem[] {
    const flat: FlatMenuItem[] = [];
    for (const item of items) {
      flat.push({...item, indentLevel: level, order: flat.length});
      if (item.children?.length) {
        flat.push(...this.flattenTree(item.children, level + 1));
      }
    }
    return flat;
  }

  drop(event: CdkDragDrop<FlatMenuItem[]>): void {
    moveItemInArray(this.flatItems, event.previousIndex, event.currentIndex);
    this.flatItems.forEach((item, idx) => (item.order = idx));
  }

  indent(index: number): void {
    if (this.flatItems[index].indentLevel < 2) {
      this.flatItems[index].indentLevel++;
    }
  }

  outdent(index: number): void {
    if (this.flatItems[index].indentLevel > 0) {
      this.flatItems[index].indentLevel--;
    }
  }

  removeItem(index: number): void {
    this.flatItems.splice(index, 1);
  }

  addItem(): void {
    this.dialog.open(CmsMenuItemDialogComponent, {data: {pages: this.pages}})
      .afterClosed().subscribe((item: CmsMenuItemSaveModel | undefined) => {
        if (item) {
          this.flatItems.push({...item, indentLevel: 0, order: this.flatItems.length});
        }
      });
  }

  save(): void {
    // Convert flat list with indentLevel to CmsMenuItemSaveModel[] with parentId
    // We use a stack approach: each item's parent is the last item with indentLevel - 1
    const result: CmsMenuItemSaveModel[] = [];
    const parentStack: (number | undefined)[] = [];

    this.flatItems.forEach((item, idx) => {
      const level = item.indentLevel;
      parentStack[level] = idx; // store this item's position for children
      const parentIdx = level > 0 ? parentStack[level - 1] : undefined;

      result.push({
        id: item.id,
        parentId: parentIdx !== undefined ? result[parentIdx]?.id : undefined,
        title: item.title,
        pageId: item.pageId,
        externalUrl: item.externalUrl,
        target: item.target,
        order: idx,
      });
    });

    this.cmsService.saveMenuItems(this.menuId, result).subscribe((res) => {
      if (res.success) {
        this.toastr.success('Menu saved');
        this.router.navigate(['/cms']);
      } else {
        this.toastr.error(res.message);
      }
    });
  }

  getPageTitle(pageId: number | undefined): string {
    if (!pageId) return '';
    return this.pages.find((p) => p.id === pageId)?.title || '';
  }

  cancel(): void {
    this.router.navigate(['/cms']);
  }
}
