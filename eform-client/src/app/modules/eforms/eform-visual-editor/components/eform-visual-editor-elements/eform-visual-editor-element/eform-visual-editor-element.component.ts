import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollapseComponent } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';
import { EformVisualEditorService } from 'src/app/common/services';

@Component({
  selector: 'app-eform-visual-editor-element',
  templateUrl: './eform-visual-editor-element.component.html',
  styleUrls: ['./eform-visual-editor-element.component.scss'],
})
export class EformVisualEditorElementComponent implements OnInit, OnDestroy {
  @ViewChild('collapse', { static: true }) collapse: CollapseComponent;
  @Input() editorElement: any;
  @Output() addNewElement: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  editorElementChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteElement: EventEmitter<number> = new EventEmitter<number>();

  collapseSub$: Subscription;

  constructor(
    private translateService: TranslateService,
    private visualEditorService: EformVisualEditorService
  ) {}

  ngOnInit() {
    this.collapseSub$ = this.visualEditorService.collapse.subscribe(
      (collapsed) => {
        if (!collapsed && this.editorElement.collapsed) {
          this.editorElement.collapsed = false;
          this.collapse.toggle();
        }
        if (collapsed && !this.editorElement.collapsed) {
          this.editorElement.collapsed = true;
          this.collapse.toggle();
        }
      }
    );
  }

  addNew(position: number) {
    this.addNewElement.emit(position);
  }

  delete(position: number) {
    this.deleteElement.emit(position);
  }

  ngOnDestroy(): void {}
}
