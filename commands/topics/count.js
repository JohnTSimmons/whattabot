const { SlashCommandBuilder } = require("discord.js");
const { count_topics } = require("../../src/database.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('count_topics')
        .setDescription('Replies with the number of unchosen topics!'),
        async execute(interaction) {
            const count = await count_topics();
            await interaction.reply('There are currently: ' + count + ' open topics!');
        },
};