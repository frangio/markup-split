#!/usr/bin/env node

import { MarkupSplit } from './command';
import { handle } from '@oclif/errors';

MarkupSplit.run().then(undefined, handle);
