const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, InteractionType } = require('discord.js');
const { handleModal } = require('./modal_handlers.js')
require('dotenv').config();

//Environment variables.
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

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

//Post Ready message.
client.once(Events.ClientReady, c => {
    console.log('We are ready! logged in as: ' + c.user.tag);
});

//Handle Commands
client.on(Events.InteractionCreate, async interaction => {
    //Handle model inputs first before checking if its a slash command.
    if (interaction.type === InteractionType.ModalSubmit){
        console.log('Modal Submitted!');
        handleModal(interaction);
        interaction.reply("200: Ok");
        return;
    }

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