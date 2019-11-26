import test from 'ava';

import { asciidoc } from './parse';

const single = `\
= Title
Description.
// markup-split: start.adoc
== Getting Started
Tutorial...
`;

test('single chunk - no adjust', t => {
  const output = `\
== Getting Started
Tutorial...
`;
  t.deepEqual([...asciidoc(single, false)], [{
    path: 'start.adoc',
    content: output,
  }]);
});

test('single chunk - adjust', t => {
  const output = `\
= Getting Started
Tutorial...
`;
  t.deepEqual([...asciidoc(single, true)], [{
    path: 'start.adoc',
    content: output,
  }]);
});
