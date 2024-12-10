const { SlashCommandBuilder } = require("discord.js");
const { category } = require("./reload");

module.exports = {
    cooldown: 5,
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('ferdil')
        .setDescription('nerd'),
    async execute(interaction) {
        await interaction.reply('https://tenor.com/view/nerd-nerd-emoji-gif-1712163874519931175')
    },
}


