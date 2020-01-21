import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from '../../../../../common/models/common';
import {SiteNameDto} from '../../../../../common/models/dto';
import {SiteTagsService} from '../../../../../common/services/advanced';
import {SiteTagsUpdateModel} from '../../../../../common/models/advanced/site-tags-update.model';

@Component({
  selector: 'app-site-tags',
  templateUrl: './site-tags.component.html',
  styleUrls: ['./site-tags.component.scss']
})
export class SiteTagsComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() onTagAdded: EventEmitter<void> = new EventEmitter<void>();
  @Output() onSiteTagsUpdated: EventEmitter<void> = new EventEmitter<void>();
  @Input() availableTags: Array<CommonDictionaryModel> = [];
  selectedSite: SiteNameDto = new SiteNameDto();
  selectedSiteTagsIds: Array<number> = [];
  tagForRemoval: number;
  spinnerStatus = false;

  constructor(private siteTagService: SiteTagsService) {
  }

  ngOnInit() {
  }

  show(selectedSite: SiteNameDto) {
    this.selectedSite = selectedSite;
    this.tagForRemoval = null;
    this.selectedSiteTagsIds = selectedSite.tags ? this.selectedSite.tags.map(x => x.key) : [];
    this.frame.show();
  }

  createNewTag(name: string) {
    if (name) {
      this.spinnerStatus = true;
      this.siteTagService.createTag(name).subscribe((operation => {
        if (operation && operation.success) {
          this.onTagAdded.emit();
        }
        this.spinnerStatus = false;
      }));
    }
  }

  updateSiteTags() {
    this.spinnerStatus = true;
    const siteTagsUpdateModel = new SiteTagsUpdateModel();
    siteTagsUpdateModel.siteId = this.selectedSite.id;
    siteTagsUpdateModel.tagsIds = this.selectedSiteTagsIds;
    this.siteTagService.updateSiteTags(siteTagsUpdateModel).subscribe((operation => {
      if (operation && operation.success) {
        this.onSiteTagsUpdated.emit();
        this.frame.hide();
      }
      this.spinnerStatus = false;
    }));
  }

  removeSiteTag() {
    this.spinnerStatus = true;
    this.siteTagService.deleteTag(this.tagForRemoval).subscribe((operation => {
      if (operation && operation.success) {
        this.onTagAdded.emit();
        this.tagForRemoval = null;
      }
      this.spinnerStatus = false;
    }));
  }
}
