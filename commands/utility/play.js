const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytsr = require('ytsr');

module.exports = {
    cooldown: 5,
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube.')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('The YouTube URL of the song to play')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        const guildId = interaction.guild.id;

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        const connection = getVoiceConnection(guildId) || joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const queue = interaction.client.queues.get(guildId) || [];
        queue.push(url); // Add song to queue
        interaction.client.queues.set(guildId, queue);

        interaction.reply(`Added to queue: ${url}`);

        if (queue.length === 1) {
            playNextSong(connection, interaction, guildId);
        }
    },
};


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
        queue.shift();
        playNextSong(connection, interaction, guildId);
    });

    player.on('error', error => {
        console.error(`Error in audio player: ${error.message}`);
        queue.shift();
        playNextSong(connection, interaction, guildId);
    });

    interaction.channel.send(`Now playing: ${url}`);
}

async function searchSong(query) {
    try {
        // Perform a YouTube search using the query
        const searchResults = await ytsr(query, { limit: 1 }); // Search for the query, limit to 1 result
        if (searchResults.items.length === 0) {
            throw new Error('No results found');
        }

        const video = searchResults.items[0]; // Get the first result
        return video.url; // Return the URL of the first video
    } catch (error) {
        console.error('Error searching for song:', error);
        return null;  // Return null if no song is found or an error occurs
    }
}