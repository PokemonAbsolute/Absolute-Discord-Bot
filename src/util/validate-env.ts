import { z } from 'zod';

import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    MYSQL_HOST: z.string(),
    MYSQL_GAME_DATABASE: z.string(),
    MYSQL_USER: z.string(),
    MYSQL_PASSWORD: z.string(),

    DISCORD_BOT_TOKEN: z.string(),
    DISCORD_BOT_CLIENT_ID: z.string(),

    DISCORD_GUILD_ID: z.string(),

    BOT_NAME: z.string(),
    BOT_COLOR: z.string(),
    BOT_LOG_CHANNEL: z.string().optional(),
    BOT_DEPLOY_COMMANDS: z.string().transform((value) => {
        value = value.toLowerCase();
        if (value == 'true') return true;
        if (value == 'false') return false;
        throw new Error(`Invalid boolean value: ${value}`);
    }),

    DEVELOPER_ID: z.string().optional(),
    DEVELOPER_USERNAME: z.string().optional(),
    DEVELOPER_NAME: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

export const validateEnvironment = () => {
    if (!parsedEnv.success) {
        console.error('Invalid environment variables:', parsedEnv.error.format());
        process.exit(1);
    }
};

export const config = parsedEnv.data as z.infer<typeof envSchema>;
