import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import schema from './schema.const';
import {Editor, toDoc, toHTML, Toolbar} from 'ngx-editor';
import {
  FormControl,
  FormGroup,
} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription} from 'rxjs';

@AutoUnsubscribe()
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'formatting-text-editor',
  templateUrl: './formatting-text-editor.component.html',
  styleUrls: ['./formatting-text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormattingTextEditorComponent implements OnInit, OnDestroy, OnChanges {
  @Input() toolbar?: Toolbar = [['bold', 'italic', 'underline', 'strike']];
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<string>();
  editor: Editor;
  form: FormGroup;

  valueChangesSub$: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.editor = new Editor({schema: schema});
    this.form = new FormGroup({
      editorContent: new FormControl({
        value: toDoc(this.value, schema),
        disabled: this.disabled,
      }),
    });
    this.valueChangesSub$ = this.form
      .get('editorContent')
      .valueChanges.subscribe((value) => {
          this.valueChange.emit(toHTML(value, schema));
          // .replace('<div>', '')
          // .replace(/<div>/ig, '<br>')
          // .replace(/<\/div>/ig, ''));
        }
      );
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && !changes.value.firstChange ||
      changes.disabled && !changes.disabled.firstChange
    ) {
      if (changes.value && !changes.value.firstChange) {
        this.form.get('editorContent').setValue(toDoc(this.value, schema), {emitEvent: false});
      }
      if (changes.disabled && !changes.disabled.firstChange) {
        if (this.disabled) {
          this.form.get('editorContent').disable({emitEvent: false});
        } else {
          this.form.get('editorContent').enable({emitEvent: false});
        }
      }
    }
  }
}
