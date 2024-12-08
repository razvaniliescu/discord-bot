const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

async function playNextSong(connection, interaction, guildId) {
    const queue = interaction.client.queues.get(guildId);

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
        queue.shift(); // Remove the played song
        playNextSong(connection, interaction, guildId);
    });

    player.on('error', error => {
        console.error(`Error in audio player: ${error.message}`);
        queue.shift();
        playNextSong(connection, interaction, guildId);
    });

    interaction.channel.send(`Now playing: ${url}`);
}

module.exports = { playNextSong };
