import { nodes as basicNodes, marks as basicMarkers } from 'ngx-editor';
import { Schema, NodeSpec } from 'prosemirror-model';

const text: NodeSpec = {
  group: 'block',
  content: 'text*',
  marks: 'strong em s u',
  parseDOM: [
    {
      tag: 'div',
    },
  ],
  toDOM(): any {
    return ['div', 0];
  },
};

const hardBreak: NodeSpec = {
  group: 'block',
  content: 'text*',
  marks: '',
  parseDOM: [
    {
      tag: 'br',
    },
  ],
  toDOM(): any {
    return ['br', 0];
  },
};

const nodes = Object.assign({}, basicNodes, {
  paragraph: text,
  hard_break: hardBreak,
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
