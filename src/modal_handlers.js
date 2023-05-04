require('dotenv').config();
const { write_topic } = require('./database.js');

async function handleModal(interaction) {
    type = interaction.customId;
    switch(type){
        case 'topicSubmit':
            await write_topic(interaction.fields.getTextInputValue('topicInput'), interaction.user.tag);
            interaction.reply("Topic submitted.")
            break
        default:
            console.warn("NO MODAL HANDLER OF TYPE: " + type);
            interaction.reply("Error.")
            return Error("No modal handler for this modal type.")
    };
};

module.exports = {
    handleModal
};