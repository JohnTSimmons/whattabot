const { SlashCommandBuilder } = require("discord.js");
const { get_topics_by_author } = require("../../src/database.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('count_own_topics')
        .setDescription('Sends a DM with your own topics.'),
        async execute(interaction) {
            await interaction.deferReply();
            const topics = await get_topics_by_author(interaction.user.tag);
            const user = interaction.user;
            await user.send("Prepare for spam, this may take a while.");
            await user.send("Number - Chosen - Content");
            let counter = 1;
            topics.forEach(topic =>{
                user.send(counter + " --- " + topic.chosen + " --- " + topic.content);
                counter += 1;
            });
            await interaction.followUp("Done!");
        },
}