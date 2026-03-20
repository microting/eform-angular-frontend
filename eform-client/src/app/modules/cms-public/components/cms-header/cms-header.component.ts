import {Component, Input, OnInit, inject} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CmsMenuItemModel, CmsMenuModel} from 'src/app/common/models';

@Component({
  standalone: false,
  selector: 'app-cms-header',
  templateUrl: './cms-header.component.html',
  styleUrls: ['./cms-header.component.scss'],
})
export class CmsHeaderComponent implements OnInit {
  @Input() menu: CmsMenuModel | null = null;
  @Input() isMenuSticky: boolean = false;

  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  isMobile$!: Observable<boolean>;
  mobileMenuOpen = false;

  ngOnInit(): void {
    this.isMobile$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches));
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth']);
  }

  navigateToItem(item: CmsMenuItemModel): void {
    if (item.externalUrl) {
      window.open(item.externalUrl, item.target || '_self');
    } else if (item.pageSlug) {
      this.router.navigate(['/landing', item.pageSlug]);
    }
  }
}
