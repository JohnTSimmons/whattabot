const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtopic')
        .setDescription('Allows you to add a topic!'),
        async execute(interaction) {
            const modal = new ModalBuilder()
            .setCustomId('topicSubmit')
            .setTitle('Topic Submission');

            const topicInput = new TextInputBuilder()
            .setCustomId('topicInput')
            .setLabel('What is your topic you would like to discuss?')
            .setMinLength(64)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);

            const actionRow = new ActionRowBuilder().addComponents(topicInput);
            modal.addComponents(actionRow);
            await interaction.showModal(modal);
        },

};