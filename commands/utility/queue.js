const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    category: 'music',
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Displays the current music queue.'),
    async execute(interaction) {
        const queue = interaction.client.queues.get(interaction.guild.id);

        if (!queue || queue.length === 0) {
            return interaction.reply('The queue is empty!');
        }

        const queueList = queue.map((url, index) => `${index + 1}. ${url}`).join('\n');
        interaction.reply(`Current Queue:\n${queueList}`);
    },
};
