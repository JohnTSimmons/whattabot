const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, InteractionType } = require('discord.js');
const { handleModal } = require('./src/modal_handlers.js');
const { get_channel, get_guild } = require('./src/channel_helpers.js');
const { start_job } = require('./src/job.js');
require('dotenv').config();

//Environment variables.
const token = process.env.DISCORD_TOKEN;

//Our discord Client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

//Collection for our commands.
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

//Add commands to our collection of commands.
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


//Handle Commands
client.on(Events.InteractionCreate, async interaction => {
    //Handle model inputs first before checking if its a chat input command.
    if (interaction.type === InteractionType.ModalSubmit){
		try {
			await handleModal(interaction);
		} catch (error) {
			console.error(error);
			if(interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this modal!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this modal!', ephemeral: true });
			}
		}
    }

	//If the command is not a chat input command just return.
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(token);

async function main(){
	//Post Ready message.
	client.once(Events.ClientReady, c => {
		console.log('We are ready! logged in as: ' + c.user.tag);
		let chan = null;
		const guild = get_guild(process.env.GUILD_ID, client).then(
			chan = get_channel(process.env.MAIN_TEXT_CHANNEL_ID, client).then(
				//this.chan.send("Started Bot")
				start_job(this.guild, this.chan).then(
					console.log('Started Job.')
				)
			)
		);
	});
};
//Run our main function.
main();