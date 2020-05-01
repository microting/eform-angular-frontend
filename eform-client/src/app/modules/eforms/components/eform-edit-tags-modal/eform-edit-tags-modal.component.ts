import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonDictionaryModel} from 'src/app/common/models/common';
import {TemplateDto} from 'src/app/common/models/dto';
import {TemplateTagsUpdateModel} from 'src/app/common/models/eforms';
import {EformTagService} from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-edit-tags-modal',
  templateUrl: './eform-edit-tags-modal.component.html',
  styleUrls: ['./eform-edit-tags-modal.component.scss']
})
export class EformEditTagsModalComponent implements OnInit {

  @ViewChild('frame', { static: true }) frame;
  @Output() onTagAdded: EventEmitter<void> = new EventEmitter<void>();
  @Output() onEFormTagsUpdated: EventEmitter<void> = new EventEmitter<void>();
  @Input() availableTags: Array<CommonDictionaryModel> = [];
  selectedTemplateDto: TemplateDto = new TemplateDto();
  selectedTemplateTagsIds: Array<number> = [];
  tagForRemoval: number;
  spinnerStatus = false;

  constructor(private eFormTagService: EformTagService) { }

  ngOnInit() {
  }

  show(selectedTemplate: TemplateDto) {
    this.selectedTemplateDto = selectedTemplate;
    this.tagForRemoval = null;
    this.selectedTemplateTagsIds = this.selectedTemplateDto.tags.map(x => x.key);
    this.frame.show();
  }

  createNewTag(name: string) {
    if (name) {
      this.eFormTagService.createTag(name).subscribe((operation => {
        if (operation && operation.success) {
          this.onTagAdded.emit();
        } this.spinnerStatus = false;
      }));
    }
  }

  updateTemplateTags() {
    const templateTagsUpdateModel = new TemplateTagsUpdateModel();
    templateTagsUpdateModel.templateId = this.selectedTemplateDto.id;
    templateTagsUpdateModel.tagsIds = this.selectedTemplateTagsIds;
    this.eFormTagService.updateTemplateTags(templateTagsUpdateModel).subscribe((operation => {
      if (operation && operation.success) {
        this.onEFormTagsUpdated.emit();
        this.frame.hide();
      } this.spinnerStatus = false;
    }));
  }

  removeTemplateTag() {
    this.eFormTagService.deleteTag(this.tagForRemoval).subscribe((operation => {
      if (operation && operation.success) {
        this.onTagAdded.emit();
        this.tagForRemoval = null;
      } this.spinnerStatus = false;
    }));
  }

}
