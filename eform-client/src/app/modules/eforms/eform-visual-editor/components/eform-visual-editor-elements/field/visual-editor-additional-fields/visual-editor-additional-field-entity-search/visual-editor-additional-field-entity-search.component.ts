import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldModel,
} from 'src/app/common/models';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EntitySearchService } from 'src/app/common/services';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MtxSelect } from '@ng-matero/extensions/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-visual-editor-additional-field-entity-search',
    templateUrl: './visual-editor-additional-field-entity-search.component.html',
    styleUrls: ['./visual-editor-additional-field-entity-search.component.scss'],
    imports: [MatCard, MatCardContent, MatFormField, MatLabel, MtxSelect, ReactiveFormsModule, FormsModule, TranslatePipe]
})
export class VisualEditorAdditionalFieldEntitySearchComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  entitySearchableGroups: CommonDictionaryModel[] = [];
  typeahead = new EventEmitter<string>();

  constructor() {
    const entitySearchService = inject(EntitySearchService);
    const cd = inject(ChangeDetectorRef);

    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((term: string) => {
          return entitySearchService.getEntitySearchableGroupsInDictionary(
            term
          );
        })
      )
      .subscribe((items) => {
        this.entitySearchableGroups = items.model;
        cd.markForCheck();
      });
  }

  ngOnInit() {
    this.typeahead.next('');
  }

  ngOnDestroy(): void {}
}
