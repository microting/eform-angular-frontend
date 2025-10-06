import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  CommonDictionaryModel,
  EformVisualEditorFieldModel,
} from 'src/app/common/models';
import { debounceTime, switchMap } from 'rxjs/operators';
import { EntitySelectService } from 'src/app/common/services';

@Component({
    selector: 'app-visual-editor-additional-field-entity-select',
    templateUrl: './visual-editor-additional-field-entity-select.component.html',
    styleUrls: ['./visual-editor-additional-field-entity-select.component.scss'],
    standalone: false
})
export class VisualEditorAdditionalFieldEntitySelectComponent
  implements OnInit, OnDestroy {
  @Input() field: EformVisualEditorFieldModel;
  entitySelectableGroups: CommonDictionaryModel[] = [];
  typeahead = new EventEmitter<string>();

  constructor() {
    const entitySelectService = inject(EntitySelectService);
    const cd = inject(ChangeDetectorRef);

    this.typeahead
      .pipe(
        debounceTime(200),
        switchMap((term: string) => {
          return entitySelectService.getEntitySelectableGroupsInDictionary(
            term
          );
        })
      )
      .subscribe((items) => {
        this.entitySelectableGroups = items.model;
        cd.markForCheck();
      });
  }

  ngOnInit() {
    this.typeahead.next('');
  }

  ngOnDestroy(): void {}
}
