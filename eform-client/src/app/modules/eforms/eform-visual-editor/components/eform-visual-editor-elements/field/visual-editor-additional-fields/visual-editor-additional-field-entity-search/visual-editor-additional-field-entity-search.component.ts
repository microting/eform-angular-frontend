import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldModel,
} from 'src/app/common/models';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EntitySearchService } from 'src/app/common/services';

@Component({
  selector: 'app-visual-editor-additional-field-entity-search',
  templateUrl: './visual-editor-additional-field-entity-search.component.html',
  styleUrls: ['./visual-editor-additional-field-entity-search.component.scss'],
})
export class VisualEditorAdditionalFieldEntitySearchComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  entitySearchableGroups: CommonDictionaryModel[] = [];
  typeahead = new EventEmitter<string>();

  constructor(entitySearchService: EntitySearchService, cd: ChangeDetectorRef) {
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
