import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  CommonTranslationsModel,
  EformVisualEditorFieldModel, LanguagesModel,
} from 'src/app/common/models';
import * as R from 'ramda';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {Overlay} from '@angular/cdk/overlay';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-visual-editor-additional-field-options',
    templateUrl: './visual-editor-additional-field-options.component.html',
    styleUrls: ['./visual-editor-additional-field-options.component.scss'],
    standalone: false
})
export class VisualEditorAdditionalFieldOptionsComponent
  implements OnInit, OnDestroy {
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private translateService = inject(TranslateService);

  @Input() field: EformVisualEditorFieldModel;
  @Input() selectedLanguages: number[];
  @Input() appLanguages: LanguagesModel = new LanguagesModel();

  get languages() {
    //return applicationLanguages;
    // wait for the appLanguages to be loaded
    if (!this.appLanguages.languages) {
      return [];
    }
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  options: string;
  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Name'), field: 'name'},
    {header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  visualEditorAdditionalFieldOptionEditComponentAfterClosedSub$: Subscription;
  visualEditorAdditionalFieldOptionDeleteComponentAfterClosedSub$: Subscription;

  ngOnInit() {
  }

  isLanguageSelected(languageId: number): boolean {
    const language = this.selectedLanguages.some((x) => x === languageId);
    const appLanguage = this.appLanguages.languages.some((x) => x.id === languageId && x.isActive);
    return language && appLanguage;
  }

  getLanguage(languageId: number): any {
    return this.appLanguages.languages.find((x) => x.id === languageId);
  }

  parseOptions() {
    if (this.options !== '') {
      const parsedOptions = R.split('\n', this.options);
      let currentCount = this.field.options.length;
      for (const parsedOption of parsedOptions) {
        const parsedTranslates = R.split('|', parsedOption);
        let translatesOptions: CommonTranslationsModel[] = [];
        for (let i = 0; i < this.appLanguages.languages.length; i++) {
          translatesOptions = [
            ...translatesOptions,
            {
              id: null,
              languageId: this.appLanguages.languages[i].id,
              description: '',
              name: parsedTranslates[i] || '',
            },
          ];
        }
        this.field.options = [
          ...this.field.options,
          {
            translates: translatesOptions,
            key: currentCount,
            id: null,
            selected: false,
            displayOrder: currentCount,
          },
        ];
        currentCount++;
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
      R.map((x) => x.name, this.languages)
    );
  }

  getExampleTooltip() {
    return `${R.join(
      '|',
      R.map((x) => 'optionTranslate' + x.id, this.languages)
    )} it's one option with ${
      this.languages.length
    } translations: ${this.getLanguageTooltip()}`;
  }

  ngOnDestroy(): void {
  }
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
    standalone: false
})
export class VisualEditorAdditionalFieldOptionEditComponent {
  dialogRef = inject<MatDialogRef<VisualEditorAdditionalFieldOptionEditComponent>>(MatDialogRef);
  fieldOptionForEdit = inject(MAT_DIALOG_DATA) ?? { selectedLanguage: 0, name: '', indexOption: 0, };


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
    <div mat-dialog-content><b class="text-warn">{{'If you delete one translation, you will delete the option completely' | translate}}</b>
    </div>
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
    standalone: false
})
export class VisualEditorAdditionalFieldOptionDeleteComponent {
  dialogRef = inject<MatDialogRef<VisualEditorAdditionalFieldOptionDeleteComponent>>(MatDialogRef);
  indexOptionForDelete = inject(MAT_DIALOG_DATA);


  hide(result = false) {
    this.dialogRef.close({result: result, model: result ? this.indexOptionForDelete : null});
  }
}
