import { EmbedBuilder } from 'discord.js';

export interface EmbedFieldOptions {
    name: string;
    value: string;
    inline: boolean;
}

export interface EmbedOptions {
    fields?: Array<EmbedFieldOptions>;

    titleText: string;
    description: string;
    color: string;
    timestamp: boolean;

    authorName?: string | undefined;
    authorIconURL?: string | undefined;
    thumbnailURL?: string | undefined;
    imageURL?: string | undefined;
    footerText?: string | undefined;
    footerIconURL?: string | undefined;
    url?: string | undefined;
}

export const createEmbed = (options: EmbedOptions) => {
    const embed = new EmbedBuilder().setColor(options.color as never);

    if (options.titleText) {
        embed.setTitle(options.titleText);
    }

    if (options.description) {
        embed.setDescription(options.description);
    }

    if (options.authorName) {
        embed.setAuthor({
            name: options.authorName,
            iconURL: options.authorIconURL,
        });
    }

    if (options.thumbnailURL) {
        embed.setThumbnail(options.thumbnailURL);
    }

    if (options.imageURL) {
        embed.setImage(options.imageURL);
    }

    if (options.url) {
        embed.setURL(options.url);
    }

    if (options.footerText || options.footerIconURL) {
        embed.setFooter({
            text: options.footerText || '',
            iconURL: options.footerIconURL,
        });
    }

    if (options.fields && options.fields.length > 0) {
        embed.addFields(options.fields);
    }

    if (options.timestamp) {
        embed.setTimestamp(new Date());
    }

    return embed;
};
