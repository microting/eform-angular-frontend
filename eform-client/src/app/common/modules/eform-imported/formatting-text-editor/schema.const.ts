import { nodes as basicNodes, marks as basicMarkers } from 'ngx-editor';
import { Schema, NodeSpec, MarkSpec } from 'prosemirror-model';

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

const markes = {
  strong: {
    toDOM() {
      return ['b', 0];
    },
    parseDOM: [{ tag: 'b' }],
  },
  em: {
    toDOM() {
      return ['i', 0];
    },
    parseDOM: [{ tag: 'i' }],
  },
  s: {
    toDOM() {
      return ['s', 0];
    },
    parseDOM: [{ tag: 's' }],
  },
  u: {
    toDOM() {
      return ['u', 0];
    },
    parseDOM: [{ tag: 'u' }],
  },
};

const myMarks = Object.assign({}, basicMarkers, markes);

const schema = new Schema({
  nodes: nodes,
  marks: myMarks,
});

export default schema;
