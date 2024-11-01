import { config } from '../util/validate-env';

import { Client } from 'discord.js';

import { createEmbed } from './embed-builder';

interface LogMessage {
    description: string;
    color: string;
}

export class LogHandler {
    private static _instance: LogHandler;

    private client: Client;
    private botLogs;

    private delay: number = 3000;
    private message_queue: Array<LogMessage> = [];
    private is_sending: boolean = false;

    constructor(client: Client) {
        this.client = client;

        if (typeof config.BOT_LOG_CHANNEL !== 'undefined') {
            this.botLogs = this.client.channels.cache.get(config.BOT_LOG_CHANNEL);
        }
    }

    public static get instance(): LogHandler {
        if (!this._instance) {
            console.error('[LogHandler] No valid instance exists.');
        }

        return this._instance;
    }

    private isSending(): boolean {
        return this.is_sending;
    }

    private sendEmbed(description: string, color: string): void {
        this.message_queue.push({ description, color });

        if (!this.isSending()) {
            this.processQueue();
        }
    }

    private processQueue() {
        if (typeof this.message_queue == 'undefined' || this.message_queue.length === 0) {
            this.is_sending = false;
            return;
        }

        this.is_sending = true;

        // @ts-expect-error - These props could be undefined, yada yada.
        const { description, color } = this.message_queue.shift();

        if (this.botLogs) {
            // @ts-expect-error - Missing properties, which are by default undefined.
            const embed = createEmbed({ description, color });

            this.botLogs
                // @ts-expect-error - Doesn't exist on client.
                .send({ embeds: [embed] })
                .catch(console.error)
                .finally(() => {
                    setTimeout(this.processQueue, this.delay);
                });
        } else {
            setTimeout(this.processQueue, this.delay);
        }
    }

    public log(...args: any): void {
        console.log(`[${config.BOT_NAME}]`, ...args);
        this.sendEmbed(args.join(' '), config.BOT_COLOR);
    }

    public error(...args: any): void {
        console.error(`[${config.BOT_NAME}]`, ...args);
        this.sendEmbed(args.join(' '), '#FF5733');
    }

    public debug(...args: any): void {
        console.log(`[${config.BOT_NAME}]`, ...args);
        this.sendEmbed(args.join(' '), '#FFAE42');
    }

    public warn(...args: any): void {
        console.warn(`[${config.BOT_NAME}]`, ...args);
        this.sendEmbed(args.join(' '), '#FFAE42');
    }
}
