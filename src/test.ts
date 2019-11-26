import fs from 'fs';

import * as parse from './parse';

console.log([...parse.asciidoc(fs.readFileSync('test.adoc', 'utf8'))])

console.log([...parse.markdown(`
# ok

<!-- markup-split: docs/test.md -->

## Oh ok

yes
`)]);
