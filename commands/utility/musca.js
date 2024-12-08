const { SlashCommandBuilder } = require("discord.js");
const { category } = require("./reload");

module.exports = {
    cooldown: 5,
    category: 'utility',
    data: new SlashCommandBuilder()
        .setName('musca')
        .setDescription('Alexandru gura de aur'),
    async execute(interaction) {
        await interaction.reply('Spre exemplu, musca. Musca... este... un... element... care nu aduce nicio atribută pozitivă nimănui. *Spre deosebire de albină*. Spr..spreee deosebiree de albină, a cărei depune efort, polenizează florile, produce miere, produce popolis, lăptișor de matcă et cetera et cetera et cetera. Da? În momentul în care albina ăăăăăă pardon, mă scuzați, musca, se așază, depune mhmhmhm, face numai, împrăștie, numai dezastru face împrăștie bacterii, bacterii peste tot. Nu are rost să continui lista. Tot ceea ce nu construiește ceva pozitiv nu echilibrează natura în tot ceea ce, nu aduce cel puțin un beneficiu naturii se încadrează în acest cerc al creației gandanice, al creației luciferiene')
    },
}


