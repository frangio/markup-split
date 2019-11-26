import { promises as fs } from 'fs';
import path from 'path';

import * as parse from './parse';

export async function split(file: string, force: boolean): Promise<void> {
  const source = await fs.readFile(file, 'utf8');

  const ext = path.extname(file);
  const parser = parsers[ext];

  if (parser === undefined) {
    throw new Error(`Extension ${ext} is not supported`);
  }

  const chunks = [...parser(source)];

  const flag = force ? 'w' : 'wx';

  await Promise.all(chunks.map(async c => {
    await fs.mkdir(path.dirname(c.path), { recursive: true });
    try {
      await fs.writeFile(c.path, c.content, { flag });
    } catch (e) {
      if (e.code === 'EEXIST') {
        throw new Error(`File '${c.path}' already exists. Use --force flag.`);
      }
    }
  }));
}

type Extension = '.md' | '.adoc';

interface Parsers {
  [ext: string]: parse.Parser | undefined;
}

const parsers: Parsers & Record<Extension, parse.Parser> = {
  ['.md']: parse.markdown,
  ['.adoc']: parse.asciidoc,
};
