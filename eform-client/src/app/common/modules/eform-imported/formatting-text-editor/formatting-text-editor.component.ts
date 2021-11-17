import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import schema from './schema.const';
import { Editor, toDoc, toHTML, Toolbar } from 'ngx-editor';
import { FormControl, FormGroup } from '@angular/forms';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'formatting-text-editor',
  templateUrl: './formatting-text-editor.component.html',
  styleUrls: ['./formatting-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormattingTextEditorComponent implements OnInit, OnDestroy {
  @Input() toolbar?: Toolbar = [['bold', 'italic', 'underline', 'strike']];
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();
  editor: Editor;
  form: FormGroup;

  valueChangesSub$: Subscription;

  constructor() {}

  ngOnInit() {
    this.editor = new Editor({ schema });
    this.form = new FormGroup({
      editorContent: new FormControl({
        value: toDoc(this.value, schema),
        disabled: this.disabled,
      }),
    });
    this.valueChangesSub$ = this.form
      .get('editorContent')
      .valueChanges.subscribe((value) =>
        this.valueChange.emit(toHTML(value, schema))
      );
  }

  ngOnDestroy() {
    this.editor.destroy();
  }
}
