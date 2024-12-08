const { SlashCommandBuilder } = require("discord.js");
const { category } = require("./reload");

module.exports = {
    cooldown: 5,
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('serban')
        .setDescription('Momentul de slabiciune'),
    async execute(interaction) {
        await interaction.reply('503212')
    },
}


