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
import { Editor, toHTML, Toolbar } from 'ngx-editor';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'formatting-text-editor',
  templateUrl: './formatting-text-editor.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FormattingTextEditorComponent implements OnInit, OnDestroy {
  @Input() toolbar?: Toolbar = [['bold', 'italic', 'underline', 'strike']];
  @Input() placeholder = '';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  editor: Editor;

  constructor() {}

  ngOnInit() {
    this.editor = new Editor({ schema });
  }

  toHtmlFunc(value: Record<string, any>) {
    return toHTML(value);
  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  onValueChanged(value: Record<string, any>) {
    this.valueChange.emit(toHTML(value));
  }
}
