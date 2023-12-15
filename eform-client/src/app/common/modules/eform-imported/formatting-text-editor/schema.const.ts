import {nodes as basicNodes, marks as basicMarkers} from 'ngx-editor';
import {Schema, NodeSpec, MarkSpec} from 'prosemirror-model';

const paragraph: NodeSpec = {
  content: 'inline*',
  group: 'block',
  marks: 'strong em s u',
  parseDOM: [
    {
      tag: 'div',
      preserveWhitespace: 'full',
    },
  ],
  toDOM() {
    return ['div', 0];
  },
};

const nodes = Object.assign({}, basicNodes, {
  paragraph,
  ordered_list: {},
  bullet_list: {},
});

const marks = {
  strong: {
    toDOM() {
      return ['b', 0];
    },
    parseDOM: [{tag: 'b'}],
  } as MarkSpec,
  em: {
    toDOM() {
      return ['i', 0];
    },
    parseDOM: [{tag: 'i'}],
  } as MarkSpec,
  s: {
    toDOM() {
      return ['s', 0];
    },
    parseDOM: [{tag: 's'}],
  } as MarkSpec,
  u: {
    toDOM() {
      return ['u', 0];
    },
    parseDOM: [{tag: 'u'}],
  } as MarkSpec,
};

const myMarks = Object.assign({}, basicMarkers, marks);

const schema = new Schema<'text' | 'doc' | 'paragraph' | 'horizontal_rule' | 'heading' | 'hard_break' | 'code_block' | 'list_item' | 'ordered_list' | 'bullet_list', 'link' | 'code' | 'em' | 's' | 'strong' | 'u' | 'text_color' | 'text_background_color'>({
  nodes: nodes,
  marks: myMarks,
});

export default schema;
