import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { EformTagService } from 'src/app/common/services/eform';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CommonDictionaryModel, TemplateDto, TemplateTagsUpdateModel} from 'src/app/common/models';

@Component({
    selector: 'app-eform-edit-tags-modal',
    templateUrl: './eform-edit-tags-modal.component.html',
    styleUrls: ['./eform-edit-tags-modal.component.scss'],
    standalone: false
})
export class EformEditTagsModalComponent implements OnInit {
  @Input() availableTags: Array<CommonDictionaryModel> = [];
  selectedTemplateDto: TemplateDto = new TemplateDto();
  selectedTemplateTagsIds: Array<number> = [];

  constructor(private eFormTagService: EformTagService,
  public dialogRef: MatDialogRef<EformEditTagsModalComponent>,
  @Inject(MAT_DIALOG_DATA) value: {
    availableTags: CommonDictionaryModel[],
    selectedTemplate: TemplateDto,
  }) {
    this.availableTags = value.availableTags ?? [];
    this.selectedTemplateDto = value.selectedTemplate;
    this.selectedTemplateTagsIds = this.selectedTemplateDto.tags.map(
      (x) => x.key
    );
  }

  ngOnInit() {}

  updateTemplateTags() {
    const templateTagsUpdateModel = new TemplateTagsUpdateModel();
    templateTagsUpdateModel.templateId = this.selectedTemplateDto.id;
    templateTagsUpdateModel.tagsIds = this.selectedTemplateTagsIds;
    this.eFormTagService
      .updateTemplateTags(templateTagsUpdateModel)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.hide(true);
        }
      });
  }

  hide(result = false) {
    this.dialogRef.close(result);
  }

  /*removeTemplateTag() {
    this.eFormTagService
      .deleteTag(this.tagForRemoval)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.onTagAdded.emit();
          this.tagForRemoval = null;
        }
      });
  }*/

  /*createNewTag(name: string) {
    if (name) {
      this.eFormTagService.createTag(name).subscribe((operation => {
        if (operation && operation.success) {
          this.onTagAdded.emit();
        }
      }));
    }
  }*/
}
