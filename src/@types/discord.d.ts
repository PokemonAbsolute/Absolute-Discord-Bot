// src/@types/discord.d.ts

import 'discord.js';
import { Collection } from 'discord.js';

declare module 'discord.js' {
    interface Client {
        commands: Collection;
        cooldowns: Collection;
        globalCooldowns: Array<unknown>;
    }
}
