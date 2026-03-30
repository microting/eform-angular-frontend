import {Component, OnInit, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CmsPageModel} from 'src/app/common/models';
import {CmsService} from 'src/app/common/services/cms';

@Component({
  standalone: false,
  selector: 'app-cms-page-edit',
  templateUrl: './cms-page-edit.component.html',
})
export class CmsPageEditComponent implements OnInit {
  private cmsService = inject(CmsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  pageId: number | null = null;
  page: CmsPageModel = {title: '', body: '', slug: '', isLandingPage: false, isPublished: false};

  tinymceConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
      'preview', 'anchor', 'searchreplace', 'visualblocks',
      'code', 'fullscreen', 'insertdatetime', 'media', 'table',
      'help', 'wordcount', 'emoticons', 'codesample'
    ],
    toolbar:
      'undo redo | styles | bold italic underline strikethrough | ' +
      'alignleft aligncenter alignright alignjustify | ' +
      'bullist numlist outdent indent | link image media table | ' +
      'forecolor backcolor | codesample emoticons charmap | ' +
      'fullscreen preview | code',
    height: 700,
    menubar: true,
    resize: true,
    image_advtab: true,
    image_caption: true,
    table_responsive_width: true,
    code_dialog_height: 500,
    code_dialog_width: 900,
    content_style:
      "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; max-width: 900px; margin: 1rem auto; }",
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.pageId = +id;
      this.loadPage(this.pageId);
    }
  }

  loadPage(id: number): void {
    this.cmsService.getPage(id).subscribe((result) => {
      if (result.success) this.page = result.model;
    });
  }

  onTitleChange(): void {
    if (!this.pageId) {
      // Auto-generate slug from title when creating new page
      this.page.slug = this.page.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
  }

  save(): void {
    if (this.pageId) {
      this.cmsService.updatePage(this.pageId, this.page).subscribe((result) => {
        if (result.success) {
          this.toastr.success('Page saved');
          this.router.navigate(['/cms']);
        } else {
          this.toastr.error(result.message);
        }
      });
    } else {
      this.cmsService.createPage(this.page).subscribe((result) => {
        if (result.success) {
          this.toastr.success('Page created');
          this.router.navigate(['/cms']);
        } else {
          this.toastr.error(result.message);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/cms']);
  }
}
