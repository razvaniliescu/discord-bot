const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Toggles loop for the current song.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        if (!interaction.client.looping) {
            interaction.client.looping = new Map();
        }

        const currentState = interaction.client.looping.get(guildId) || false;
        const newState = !currentState;

        interaction.client.looping.set(guildId, newState);

        const queue = interaction.client.queues.get(guildId);
        if (newState && queue && queue.length > 0) {
            const currentSong = queue[0];
            queue.unshift(currentSong);
        }

        await interaction.reply({
            content: `Looping has been ${newState ? 'enabled' : 'disabled'} for the current song.`,
            ephemeral: true,
        });
    },
};