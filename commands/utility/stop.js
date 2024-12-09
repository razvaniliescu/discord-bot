const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    cooldown: 5,
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and disconnects the bot from the voice channel.'),
    async execute(interaction) {
        const connection = getVoiceConnection(interaction.guild.id);

        if (!connection) {
            return interaction.reply({
                content: 'I am not connected to any voice channel!',
                ephemeral: true,
            });
        }

        const guildId = interaction.guild.id;
        if (interaction.client.queues && interaction.client.queues.has(guildId)) {
            interaction.client.queues.delete(guildId);
        }

        connection.destroy();

        interaction.client.looping.set(guildId, false);

        await interaction.reply({
            content: 'Stopped the music and left the voice channel!',
        });
    },
};