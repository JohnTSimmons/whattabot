const { SlashCommandBuilder } = require("discord.js");
const { count_topics_by_author } = require("../../src/database.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_submission_count_by_author')
        .setDescription('Get the number of topics submitted by a user.')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Username to count.')
            .setRequired(true)),
        async execute(interaction) {
            const target = interaction.options.getUser('user')
            let topics_count = [0, 0];
            topics_count = await count_topics_by_author(target.tag);
            interaction.reply(target.tag +" has submitted " + topics_count[0] + " topics. " + topics_count[1] + " have been chosen.");
        },
};