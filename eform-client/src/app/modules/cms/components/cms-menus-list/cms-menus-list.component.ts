import {Component, OnInit, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CmsMenuModel} from 'src/app/common/models';
import {CmsService} from 'src/app/common/services/cms';

@Component({
  standalone: false,
  selector: 'app-cms-menus-list',
  templateUrl: './cms-menus-list.component.html',
})
export class CmsMenusListComponent implements OnInit {
  private cmsService = inject(CmsService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  menus: CmsMenuModel[] = [];
  newMenuName = '';
  showNewMenuForm = false;

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.cmsService.getAllMenus().subscribe((result) => {
      if (result.success) this.menus = result.model;
    });
  }

  editMenu(id: number): void {
    this.router.navigate(['/cms/menus', id]);
  }

  createMenu(): void {
    if (!this.newMenuName.trim()) return;
    this.cmsService.createMenu({name: this.newMenuName, items: []}).subscribe((result) => {
      if (result.success) {
        this.toastr.success('Menu created');
        this.newMenuName = '';
        this.showNewMenuForm = false;
        this.loadMenus();
      } else {
        this.toastr.error(result.message);
      }
    });
  }

  deleteMenu(id: number): void {
    if (!confirm('Delete this menu?')) return;
    this.cmsService.deleteMenu(id).subscribe((result) => {
      if (result.success) {
        this.toastr.success('Menu deleted');
        this.loadMenus();
      } else {
        this.toastr.error(result.message);
      }
    });
  }
}
