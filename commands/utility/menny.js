const { SlashCommandBuilder } = require("discord.js");
const { category } = require("./reload");

module.exports = {
    cooldown: 5,
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('menny')
        .setDescription('mog'),
    async execute(interaction) {
        await interaction.reply('https://tenor.com/view/daniel-dae-kim-mogged-mogger-looksmaxxing-ruggyscruggy-gif-1507416034755076487')
    },
}


