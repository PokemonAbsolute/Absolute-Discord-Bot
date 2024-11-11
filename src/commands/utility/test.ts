import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { CommandInterface } from '../../types/command';

const TEST: CommandInterface = {
    name: 'test',
    description: 'Generic test command. Does nothing.',

    category: 'utility',
    cooldown: 0,

    permissions: [],

    developerOnly: false,
    ownerOnly: false,

    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Generic test command. Does nothing.'),

    execute: async (interaction) => {
        try {
            await interaction.deferReply();

            const COMMAND_EMBED = new EmbedBuilder()
                .setTitle('Testing, Testing')
                .setDescription('Generic test command. Does nothing.')
                .setColor('#4a618f')
                .setTimestamp();

            await interaction.editReply({ embeds: [COMMAND_EMBED] });
            return;
        } catch (err) {
            console.warn('[Command | Test] An error occurred:', err);
        }
    },
};

export default TEST;
