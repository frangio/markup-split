import test, { ExecutionContext } from 'ava';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

import { split } from './split';

async function fixture(t: ExecutionContext, name: string): Promise<void> {
  const ext = name.includes('asciidoc') ? 'adoc' : 'md';
  const adjust = !name.includes('no-adjust');

  const temp = await fs.mkdtemp(`${os.tmpdir()}/markup-split-`);
  await copyDir(`fixtures/${name}`, temp);

  await split(`${temp}/input.${ext}`, false, adjust);

  for (const entry of await fs.readdir(temp)) {
    if (entry.endsWith('.expected')) {
      t.is(
        await fs.readFile(`${temp}/${entry}`, 'utf8'),
        await fs.readFile(`${temp}/${path.basename(entry, '.expected')}`, 'utf8'),
      );
    }
  }
}

fixture.title = (title = '', name: string) => name.replace('-', ' - ');

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });

  await Promise.all(
    (
      await fs.readdir(src, { withFileTypes: true })
    ).map(async entry => {
      const src1 = path.join(src, entry.name);
      const dest1 = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(src1, dest1);
      } else {
        await fs.copyFile(src1, dest1);
      }
    })
  );
}

test(fixture, 'asciidoc-single-adjust');
test(fixture, 'asciidoc-multiple-adjust');
