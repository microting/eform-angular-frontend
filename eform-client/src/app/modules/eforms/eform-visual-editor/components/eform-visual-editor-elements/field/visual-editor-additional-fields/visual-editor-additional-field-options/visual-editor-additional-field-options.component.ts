import {Component, Inject, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  CommonTranslationsModel,
  EformVisualEditorFieldModel,
} from 'src/app/common/models';
import * as R from 'ramda';
import {applicationLanguages} from 'src/app/common/const';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Overlay} from '@angular/cdk/overlay';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
  selector: 'app-visual-editor-additional-field-options',
  templateUrl: './visual-editor-additional-field-options.component.html',
  styleUrls: ['./visual-editor-additional-field-options.component.scss'],
})
export class VisualEditorAdditionalFieldOptionsComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];
  options: string;
  tableHeaders: MtxGridColumn[] = [
    { header: this.translateService.stream('Name'), field: 'name' },
    { header: this.translateService.stream('Actions'), field: 'actions' },
  ];
  visualEditorAdditionalFieldOptionEditComponentAfterClosedSub$: Subscription;
  visualEditorAdditionalFieldOptionDeleteComponentAfterClosedSub$: Subscription;

  constructor(
    private dialog: MatDialog,
    private overlay: Overlay,
    private translateService: TranslateService,
    ) {}

  ngOnInit() {}

  isLanguageSelected(languageId: number): boolean {
    return this.selectedLanguages.some((x) => x === languageId);
  }

  getLanguage(languageId: number): string {
    return applicationLanguages.find((x) => x.id === languageId).text;
  }

  parseOptions() {
    if (this.options !== '') {
      const parsedOptions = R.split('\n', this.options);
      for (const parsedOption of parsedOptions) {
        const parsedTranslates = R.split('|', parsedOption);
        let translatesOptions: CommonTranslationsModel[] = [];
        for (let i = 0; i < applicationLanguages.length; i++) {
          translatesOptions = [
            ...translatesOptions,
            {
              id: null,
              languageId: applicationLanguages[i].id,
              description: '',
              name: parsedTranslates[i] || '',
            },
          ];
        }
        this.field.options = [
          ...this.field.options,
          {
            translates: translatesOptions,
            key: this.field.options.length,
            id: null,
            selected: false,
            displayOrder: this.field.options.length,
          },
        ];
      }
      this.options = '';
    }
  }

  getTranslationOptionsByLanguageId(
    languageId: number
  ): CommonTranslationsModel[] {
    return R.filter(
      (x) => x.languageId === languageId,
      R.flatten(R.map((x) => x.translates, this.field.options))
    );
  }

  openEditOptionTranslate(indexOption: number, selectedLanguage: number) {
    const fieldOptionForEdit = {
      name: this.field.options[indexOption].translates.find(
        (x) => x.languageId === selectedLanguage
      ).name,
      indexOption: indexOption,
      selectedLanguage: selectedLanguage,
    };
    this.visualEditorAdditionalFieldOptionEditComponentAfterClosedSub$ = this.dialog.open(VisualEditorAdditionalFieldOptionEditComponent,
      {...dialogConfigHelper(this.overlay, fieldOptionForEdit)})
      .afterClosed()
      .subscribe(data => data.result ? this.save(data.model) : undefined);
  }

  openDeleteOptionTranslate(indexOption: number) {
    this.visualEditorAdditionalFieldOptionDeleteComponentAfterClosedSub$ =
      this.dialog.open(VisualEditorAdditionalFieldOptionDeleteComponent,
        {...dialogConfigHelper(this.overlay, indexOption), maxWidth: 300})
        .afterClosed()
        .subscribe(data => data.result ? this.delete(data.model) : undefined);
  }

  save(fieldOptionForEdit: { selectedLanguage: number, name: string, indexOption: number, }) {
    this.field.options[fieldOptionForEdit.indexOption].translates.find(
      (x) => x.languageId === fieldOptionForEdit.selectedLanguage
    ).name = fieldOptionForEdit.name;
  }

  delete(indexOptionForDelete: number) {
    this.field.options = this.field.options.filter(
      (x, index) => index !== indexOptionForDelete
    );
  }

  getLanguageTooltip() {
    return R.join(
      ', ',
      R.map((x) => x.text, applicationLanguages)
    );
  }

  getExampleTooltip() {
    return `${R.join(
      '|',
      R.map((x) => 'optionTranslate' + x.id, applicationLanguages)
    )} it's one option with ${
      applicationLanguages.length
    } translations: ${this.getLanguageTooltip()}`;
  }

  ngOnDestroy(): void {}
}

@Component({
  selector: 'app-visual-editor-additional-field-option-edit-component',
  template: `
    <div mat-dialog-content>
      <mat-form-field>
        <mat-label>{{ 'Option translate' | translate }}</mat-label>
        <input
          [(ngModel)]="fieldOptionForEdit.name"
          id="optionTranslateEdit"
          matInput
          type="text"
        />
      </mat-form-field>
    </div>
    <div mat-dialog-actions class="d-flex flex-row justify-content-end">
      <button
        mat-raised-button
        color="accent"
        (click)="hide(true)"
        id="changeFieldOptionTranslateSaveBtn"
      >
        {{ 'Save' | translate }}
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="hide()"
        id="changeFieldOptionTranslateSaveCancelBtn"
      >
        {{ 'Cancel' | translate }}
      </button>
    </div>`,
})
export class VisualEditorAdditionalFieldOptionEditComponent {
  constructor(
    public dialogRef: MatDialogRef<VisualEditorAdditionalFieldOptionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public fieldOptionForEdit = { selectedLanguage: 0, name: '', indexOption: 0, }
  ) {}
  hide(result = false) {
    this.dialogRef.close({result: result, model: result ? this.fieldOptionForEdit : null});
  }
}

@Component({
  selector: 'app-visual-editor-additional-field-option-delete-component',
  template: `
    <div mat-dialog-title>
      {{ 'Are you sure you want to delete it' | translate }}?
    </div>
    <div mat-dialog-content><b class="text-warn">{{'If you delete one translation, you will delete the option completely' | translate}}</b></div>
    <div mat-dialog-actions class="d-flex flex-row justify-content-end">
      <button
        mat-raised-button
        color="warn"
        (click)="hide(true)"
        id="deleteFieldOptionTranslateSaveBtn"
      >
        {{ 'Delete' | translate }}
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="hide()"
        id="deleteFieldOptionTranslateSaveCancelBtn"
      >
        {{ 'Cancel' | translate }}
      </button>
    </div>`,
})
export class VisualEditorAdditionalFieldOptionDeleteComponent {
  constructor(
    public dialogRef: MatDialogRef<VisualEditorAdditionalFieldOptionDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public indexOptionForDelete: number,
  ) {}
  hide(result = false) {
    this.dialogRef.close({result: result, model: result ? this.indexOptionForDelete : null});
  }
}
