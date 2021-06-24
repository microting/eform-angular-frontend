import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import {
  CommonDictionaryModel,
  EformVisualEditorModel,
} from 'src/app/common/models';
import { SharedTagsComponent } from 'src/app/common/modules/eform-shared-tags/components';
import { EformTagService } from 'src/app/common/services';

@AutoUnsubscribe()
@Component({
  selector: 'app-eform-visual-editor-container',
  templateUrl: './eform-visual-editor-container.component.html',
  styleUrls: ['./eform-visual-editor-container.component.scss'],
})
export class EformVisualEditorContainerComponent implements OnInit, OnDestroy {
  newTemplateModel: EformVisualEditorModel = new EformVisualEditorModel();
  availableTags: CommonDictionaryModel[] = [];
  @ViewChild('tagsModal') tagsModal: SharedTagsComponent;

  getTagsSub$: Subscription;

  constructor(private tagsService: EformTagService) {}

  ngOnInit(): void {
    this.getTags();
  }

  getTags() {
    this.getTagsSub$ = this.tagsService.getAvailableTags().subscribe((data) => {
      if (data && data.success) {
        this.availableTags = data.model;
      }
    });
  }

  createTemplate() {}

  openTagsModal() {
    this.tagsModal.show();
  }

  ngOnDestroy(): void {}
}
