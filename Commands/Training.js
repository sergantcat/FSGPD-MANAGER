// Greetings This cmd is not made by Ai 
const {
    SlashCommandBuilder,
    ContainerBuilder,
    SeparatorBuilder,
    TextDisplayBuilder,
    Colors,
    MessageFlags,
    AttachmentBuilder
} = require("discord.js");

const {Pool} = require(.../.../db.js)

const {randomUUID} = require("crypto"); //This generates the Training id

const trainingId = randomUUID(); // This declares the randomUUID as trainingid

const TRAINING_CHANNNEL_ID = process.env.TRAINING_CHANNNEL_ID // Sets the channel and Such

const TRAINING_HOST_REMINDER_CHANNEL_ID = process.env.TRAINING_HOST_REMINDER_CHANNEL_ID


const appemoji = '<:deniedemoji:1548978077848174632>';


const TRAINING_HOST_IDS = (process.env.TRAINING_HOST_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

function hasAllowedRole(member) {
    if (!member?.roles?.cache) return false;
    return member.roles.cache.some((role) => TRAINING_HOST_IDS.includes(role.id));
}


 
module.exports = {
    data: new SlashCommandBuilder()
        .setName("training")
        .setDescription("[THP] alows to host a Training.")
        .addStringOption(option =>
            option
            .setName('Training Type')
            .setRequired(true)
            .setDescription('Choose The Type of Training To host.')
            .addChoices(
         {name:'Combat Training', value:'combat_training'},
         {name:'Knowledge Training', value:'Knowledge_training'}
        )
    ) 

      .addSubcommand((subcommand) =>
		subcommand
			.setName('training-cancel')
			.setDescription('[THP] alows to cancel Trainings.') 
            .addIntegerOption(option =>
                option
                .setName('Training')
                .setDescription('Training you want to cancel')
                .setAutocomplete(true)
                .setRequired(true)
               

            )
        )
			
        .addSubcommand((subcommand) =>
		subcommand
			.setName('training-conclude')
			.setDescription('[THP] alows to conclude Trainings.') 
            .addIntegerOption(option =>
                option
                .setName('Training')
                .setDescription('Training you want to conclude')
                .setAutocomplete(true)
                .setRequired(true)
               

            )
        )
       .addSubcommand((subcommand) =>
		subcommand
			.setName('training-conclude')
			.setDescription('[THP] alows to conclude Trainings.') 
            .addIntegerOption(option =>
                option
                .setName('Training')
                .setDescription('Training you want to conclude')
                .setAutocomplete(true)
                .setRequired(true)
               

            )
        ),
        
        async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        
        // Get the filtered database rows from our helper
        const choices = await getTrainingChoices(focusedValue);

        // Respond immediately to Discord
        await interaction.respond(choices);
         },

}