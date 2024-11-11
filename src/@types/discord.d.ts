// src/@types/discord.d.ts

import 'discord.js';

import { Collection } from 'discord.js';

import { CommandManager } from '../classes/CommandManager';

declare module 'discord.js' {
    interface Client {
        commands: Collection;
        cooldowns: Collection;
        globalCooldowns: Array<unknown>;

        commandManager: CommandManager;
    }
}
