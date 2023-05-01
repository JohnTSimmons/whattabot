require('dotenv').config();
db = require('./database.js');


async function submitTopic(msg, author){
    db.write_topic(msg, author)
};

function handleModal(interaction) {
    type = interaction.customId;
    switch(type){
        case 'topicSubmit':
            submitTopic(interaction.fields.getTextInputValue('topicInput'), interaction.user.username);
            break
        default:
            console.warn("NO MODAL HANDLER OF TYPE: " + type);
    };
};

module.exports = {
    handleModal
};