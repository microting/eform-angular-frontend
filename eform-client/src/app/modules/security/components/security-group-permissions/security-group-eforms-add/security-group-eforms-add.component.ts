import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {TemplateListModel, EformBindGroupModel} from 'src/app/common/models';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services';
import { MtxGridColumn, MtxGrid } from '@ng-matero/extensions/grid';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-security-group-eforms-add',
    templateUrl: './security-group-eforms-add.component.html',
    styleUrls: ['./security-group-eforms-add.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, MtxGrid, MatDialogActions, MatButton, TranslatePipe]
})
export class SecurityGroupEformsAddComponent implements OnInit {
  private securityGroupEformsService = inject(SecurityGroupEformsPermissionsService);
  private translateService = inject(TranslateService);
  dialogRef = inject<MatDialogRef<SecurityGroupEformsAddComponent>>(MatDialogRef);

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id', class: 'cursor-pointer',},
    {
      header: this.translateService.stream('CreatedAt'),
      field: 'createdAt',
      type: 'date',
      typeParameter: {format: 'dd.MM.y HH:mm:ss'},
      class: 'cursor-pointer',
    },
    {
      header: this.translateService.stream('eForm Name'),
      field: 'label',
      class: 'cursor-pointer',
    },
  ];

  templateListModel: TemplateListModel = new TemplateListModel();
  onEformBound: EventEmitter<void> = new EventEmitter<void>();
  onSearchInputChanged: EventEmitter<string> = new EventEmitter<string>();
  eformBindGroupModel: EformBindGroupModel = new EformBindGroupModel();

  constructor() {
    const model = inject<{
    templateListModel: TemplateListModel;
    selectedGroupId: number;
}>(MAT_DIALOG_DATA);

    this.templateListModel = model.templateListModel;
    this.eformBindGroupModel.groupId = model.selectedGroupId;
  }

  ngOnInit() {
  }

  addEformToGroup(eformId: number) {
    this.eformBindGroupModel.eformId = eformId;
    this.securityGroupEformsService.addEformToGroup(this.eformBindGroupModel).subscribe((data) => {
      if (data && data.success) {
        this.onEformBound.emit();
      }
    });
  }

  onLabelInputChanged(label: string) {
    this.onSearchInputChanged.emit(label);
  }

  hide() {
    this.dialogRef.close();
  }

}
