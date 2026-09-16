const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const {
  Client,
  Collection,
  ContainerBuilder,
  GatewayIntentBits,
  MessageFlags,
  SeparatorBuilder,
  TextDisplayBuilder,
  Colors
} = require('discord.js');
const {startReminderLoop} = require('./utils/trainingReminders');



const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;


if (!token || !clientId) {
  console.error('Error bot token and client id not configured Error code Delta 3');
  process.exit(1);
}



const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

function createErrorReply(message) {
  const errorContainer = new ContainerBuilder()
    .setAccentColor(Colors.Red)
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent('## Command Error')
    )
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(message)
    );

  return {
    components: [errorContainer],
    flags: MessageFlags.Ephemeral | MessageFlags.IsComponentsV2
  };
}

const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

async function registerCommands() {
  const url = `https://discord.com/api/v10/applications/${clientId}/commands`;

  try {
    const commandData = Array.from(client.commands.values()).map(command => command.data.toJSON());

    console.log('Sending slash commands to Discord API...');
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commandData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Slash commands registered successfully!');
      
    } else {
      console.error('Error in Discord API: error code Delta 2', data);
    }
  } catch (error) {
    console.error('Error sending request to Discord API Error code Delta 1', error);
  }
}

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  startReminderLoop(client);
  await registerCommands();
});

client.on('interactionCreate', async interaction => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.autocomplete) return;

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error('Autocomplete error:', error);
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    try {
      const reply = createErrorReply('There was an error while executing this command.');

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    } catch (replyError) {
      console.error('Failed to send interaction error response:', replyError);
    }
  }
});

client.login(token);
