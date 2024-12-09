const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    cooldown: 5,
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube.')
        .addStringOption(option => 
            option.setName('song')
                .setDescription('The YouTube song to play')
                .setRequired(true)),
    async execute(interaction) {
        const songName = interaction.options.getString('song');
        const url = await searchSong(songName);
        if (!url) {
            return interaction.reply({
                content: 'Could not find the song. Please try again!',
                ephemeral: true,
            });
        }
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

        if (!interaction.client.queues) interaction.client.queues = new Map();
        const queue = interaction.client.queues.get(guildId) || [];

        const isPlaying = queue.length > 0;
        queue.push(url);
        interaction.client.queues.set(guildId, queue);

        if (isPlaying) {
            return interaction.reply(`Added to queue: ${url}`);
        }

        playNextSong(connection, interaction, guildId);
        return interaction.reply(`Now playing: ${url}`);
    },
};


async function playNextSong(connection, interaction, guildId) {
    if (!interaction.client.looping.has(guildId)) {
        interaction.client.looping.set(guildId, false);  // Set default loop state as false
    }

    const queue = interaction.client.queues.get(guildId);
    const loopEnabled = interaction.client.looping.get(guildId); // Check if loop is enabled

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
        // If loop is enabled, push the song back to the queue
        if (loopEnabled) {
            queue.push(url);
        }
        playNextSong(connection, interaction, guildId);
    });

    player.on('error', error => {
        console.error(`Error in audio player: ${error.message}`);
        queue.shift();
        playNextSong(connection, interaction, guildId);
    });
}


async function searchSong(query) {
    try {
        const searchResults = await ytSearch(query);
        const videoResult = searchResults.videos[0];

        if (!videoResult) {
            throw new Error('No video results found.');
        }

        return videoResult.url;
    } catch (error) {
        if (error.message.includes('type shortsLockupViewModel is not known')) {
            console.warn('Warning: Skipping unknown Shorts type.');
        } else {
            console.error('Error searching for song:', error);
        }
        return null;
    }
}