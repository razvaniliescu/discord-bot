const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, createAudioResource, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    cooldown: 5,
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const connection = getVoiceConnection(guildId);

        if (!connection) {
            return interaction.reply('I am not connected to any voice channel!');
        }

        const queue = interaction.client.queues.get(guildId);

        if (!queue || queue.length === 0) {
            return interaction.reply('There is no song to skip!');
        }

        queue.shift();
        interaction.client.queues.set(guildId, queue);

        interaction.reply('Skipped the current song!');
        playNextSong(connection, interaction, guildId);
    },
};

async function playNextSong(connection, interaction, guildId) {
    if (!interaction.client.looping.has(guildId)) {
        interaction.client.looping.set(guildId, false);
    }

    const queue = interaction.client.queues.get(guildId);
    const loopEnabled = interaction.client.looping.get(guildId);

    if (!queue || queue.length === 0) {
        connection.destroy();
        interaction.client.queues.delete(guildId);
        return;
    }

    const url = queue[0];
    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
        if (loopEnabled) {
            queue.unshift(queue.shift());
        } else {
            queue.shift();
        }
        playNextSong(connection, interaction, guildId);
    });

    player.on('error', error => {
        console.error(`Error in audio player: ${error.message}`);
        queue.shift();
        playNextSong(connection, interaction, guildId);
    });

    interaction.channel.send(`Now playing: ${url}`);
}
