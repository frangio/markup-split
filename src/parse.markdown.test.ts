import test from 'ava';

import { markdown } from './parse';

const single = `\
# Title
Description.
<!-- markup-split: start.md -->
## Getting Started
Tutorial...
`;

test('single chunk - no adjust', t => {
  const output = `\
## Getting Started
Tutorial...
`;
  t.deepEqual([...markdown(single, false)], [{
    path: 'start.md',
    content: output,
  }]);
});

test('single chunk - adjust', t => {
  const output = `\
# Getting Started
Tutorial...
`;
  t.deepEqual([...markdown(single, true)], [{
    path: 'start.md',
    content: output,
  }]);
});

