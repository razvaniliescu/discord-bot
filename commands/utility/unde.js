const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unde')
        .setDescription('UNDE ESTE')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to tag')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        await interaction.reply({
            content: `UNDE ESTE ${user}?`,
            allowedMentions: { users: [user.id] }
        });
    },
};