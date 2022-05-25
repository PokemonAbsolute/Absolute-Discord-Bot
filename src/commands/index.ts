import { CommandInterface } from '../types/command';

import COMMAND_LIST from './commands';
import LAST_SEEN from './lastseen';
import TEST from './test';
import RARITY from './rarity';

export const COMMAND_DICTIONARY: CommandInterface[] = [
  COMMAND_LIST,
  LAST_SEEN,
  RARITY,
  TEST,
];
