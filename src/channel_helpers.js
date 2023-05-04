const { get_topic } = require('./database.js');

async function get_channel(channel_id, client){
    chan = client.channels.cache.get(channel_id);
    return new Promise(resolve => {
        resolve(chan);
    }, "Error getting channel.");
}

async function get_guild(guild_id, client){
    guild = client.guilds.cache.get(guild_id);;
    return new Promise(resolve => {
        resolve(guild);
    }, "Error getting guild.");
}

module.exports = {
    get_channel, get_guild
}