interface Chunk {
  path: string;
  content: string;
}

interface Syntax {
  directive: RegExp;
  heading: RegExp;
}

export type Parser = typeof asciidoc;

export function *asciidoc(source: string, adjust: boolean): Generator<Chunk, void> {
  const syntax = {
    directive: /^\/\/\s*markup-split:\s*(?<path>.+)$/m,
    heading: /^=(?==+)/gm,
  };

  yield* parse(syntax, source, adjust);
}

export function *markdown(source: string, adjust: boolean): Generator<Chunk, void> {
  const syntax = {
    directive: /^<!--\s*markup-split:\s*(?<path>.+)\s*-->$/m,
    heading: /^#(?=#+)/gm,
  };

  yield* parse(syntax, source, adjust);
}

function *parse(
  syntax: Syntax,
  source: string,
  adjust: boolean,
): Generator<Chunk, void> {

  const scanner = new Scanner(source);

  const directives = [...scanner.scan(syntax.directive)];

  for (const [i, d] of directives.entries()) {
    const { path } = d.groups!;

    const raw = source.slice(
      d.index + d[0].length + 1,
      directives[i+1]?.index ?? source.length,
    );

    const content = adjust ? raw.replace(syntax.heading, '') : raw;

    yield { path, content };
  }
}

class Scanner {
  index: number = 0;

  constructor(readonly source: string) { }

  *scan(re: RegExp): Generator<RegExpExecArray, void> {
    const global = makeGlobal(re);
    global.lastIndex = this.index;
    while (true) {
      const res = this.exec(re);
      if (res === undefined) {
        return;
      } else {
        yield res;
      }
    }
  }

  exec(re: RegExp): RegExpExecArray | undefined {
    const global = makeGlobal(re);
    global.lastIndex = this.index;
    const res = global.exec(this.source);
    if (res === null) {
      this.index = this.source.length;
    } else {
      this.index = global.lastIndex;
    }
    return res ?? undefined;
  }
}

function makeGlobal(re: RegExp) {
  const flags = new Set(re.flags);
  flags.add('g');
  flags.delete('y');
  return new RegExp(re, [...flags].join(''));
}
