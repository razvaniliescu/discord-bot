const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggles loop for the current song.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const currentState = interaction.client.looping.get(guildId) || false;

        interaction.client.looping.set(guildId, !currentState);

        const newState = !currentState ? 'enabled' : 'disabled';

        await interaction.reply({
            content: `Looping has been ${newState} for the current song.`,
            ephemeral: true,
        });
    },
};