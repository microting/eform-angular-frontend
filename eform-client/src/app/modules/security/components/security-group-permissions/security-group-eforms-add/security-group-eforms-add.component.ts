import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {TemplateListModel, EformBindGroupModel} from 'src/app/common/models';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {TranslateService} from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-security-group-eforms-add',
    templateUrl: './security-group-eforms-add.component.html',
    styleUrls: ['./security-group-eforms-add.component.scss'],
    standalone: false
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
