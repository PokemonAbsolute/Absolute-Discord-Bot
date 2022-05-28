import { CommandInterface } from '../types/command';

import COMMAND_LIST from './commands';
import LAST_SEEN from './lastseen';
import CONNECT from './connect';
import RARITY from './rarity';
import TEST from './test';

export const COMMAND_DICTIONARY: CommandInterface[] = [
  COMMAND_LIST,
  LAST_SEEN,
  CONNECT,
  RARITY,
  TEST,
];
