import os from 'os';
import { execSync } from 'child_process';

import packageInfo from '../../package.json';

import { CommandInteraction, CacheType, version } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';

import { CommandInterface } from '../types/command';

import { createEmbed, EmbedOptions } from '../handlers/embed-builder';

// Current Node.JS version
const getNodeInfo = () => {
    return execSync('node -v').toString().trim();
};

// Get timestamp in 'd h m s' format
const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

// Get current memory usage
const getMemoryUsage = () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usedMemMB = usedMem / (1024 * 1024);
    const usedMemPercent = (usedMem / totalMem) * 100;

    return { usedMemMB, usedMemPercent };
};

const BOTSTATUS: CommandInterface = {
    name: 'status',
    description: 'Displays the current run-time information of Absolute bot.',
    developerOnly: true,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Displays the current run-time information of Absolute bot.'),

    run: async (interaction: CommandInteraction<CacheType>): Promise<void> => {
        const client = interaction.client;

        const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

        await interaction.deferReply();

        const embedOptions: EmbedOptions = {
            fields: [
                {
                    name: '**Host status**',
                    value:
                        `\`\`\`\n` +
                        `• OS: ${os.type()} ${os.release()} (${os.arch()})\n` +
                        `• Uptime: ${formatUptime(os.uptime())}\n` +
                        `• Avaiable Memory: ${(os.totalmem() / (1024 * 1024)).toFixed(2)}MB\n` +
                        `• Memory Usage: ${getMemoryUsage().usedMemMB.toFixed(
                            2
                        )}MB (${getMemoryUsage().usedMemPercent.toFixed(2)}%)\n` +
                        `• Node.js: ${getNodeInfo()}\n\`\`\``,
                    inline: false,
                },
                {
                    name: '**Bot info**',
                    value:
                        `\`\`\`\n` +
                        `• Bot Version: ${packageInfo.version}\n` +
                        `• Discord.js Version: ${version}\n` +
                        `• Client Ping: ${
                            (await interaction.fetchReply()).createdTimestamp -
                            interaction.createdTimestamp
                        }ms\n` +
                        `• Client Uptime: ${formatUptime(client.uptime / 1000)}\n` +
                        `• Guild Count: ${client.guilds.cache.size}\n` +
                        `• User Count: ${totalUsers}\n` +
                        `• Channel Count: ${client.channels.cache.size}\n\`\`\``,
                    inline: false,
                },
            ],

            titleText: 'Absolute Bot Server Status',
            description: "Misc. information about Absolute Bot's runtime.",
            color: '#4A618F',
            timestamp: true,
        };

        const embed = createEmbed(embedOptions);

        await interaction.editReply({ embeds: [embed] });
    },
};

export default BOTSTATUS;
