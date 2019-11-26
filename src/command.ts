import { Command, flags } from '@oclif/command'

import { split } from './split';

export class MarkupSplit extends Command {
  static description = 'Split a file using commented directives';

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),

    force: flags.boolean({
      char: 'f',
    }),
  };

  static strict = false;

  static args = [{
    name: 'file',
    description: 'input file',
  }];

  async run() {
    const { flags, argv } = this.parse(MarkupSplit);

    const { force } = flags;
    const files = argv;

    if (files.length === 0) {
      this._help();
    }

    await Promise.all(files.map(f => split(f, force)));
  }
}
