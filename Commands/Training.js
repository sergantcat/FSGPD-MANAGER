// Greetings This cmd is not made by Ai 
const {randomUUID} = require("crypto"); //This generates the Training id
const {SlashCommandBuilder, MessageFlags} = require("discord.js");
const db = require('../db')
const{successContainer, failureContainer,trainingContainer,hasHostRole, postToChannel,MesssageFlags} = require('../utils/trainingComponents')

module.exports = {
data: new SlashCommandBuilder()
.setName('host-training')
.setDescription('[THP] Command to host a Training')
.addIntegerOption(o=>
    o
    .setName('time')
    .setDescription('Unix Timestamp')
    .setRequired(true)),

    async execute(interaction) {
        if(!hasHostRole(interaction.member)){
        return interaction.reply({
             components:[failureContainer('Permission Denied','You do not have the Required Rank to Host Trainings.')],
             flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral 
         });
        }
    
    await interaction.deferReply();

    try {
        const time = interaction.options.getInteger('time');
        if (time * 1000 < Date.now()) {
            return interaction.editReply({
                components:[failureContainer('ScheduleFailed','That Unix Timestamp is in the past bro')],
                flags: MessageFlags.IsComponentsV2
            });
        }
        const id = randomUUID();
        await db('trainings').insert({
            id, host: interaction.user.id, time, status:'Scheduled', reminded:false
        })

        const trainingMessage = await postToChannel(
            interaction.client,
            trainingContainer(interaction.user.id, id, time)
        );
        await trainingMessage.react('✅');
        return interaction.editReply({ components:[successContainer('Training Scheduled succesfully', `ID: \`${id}\``)],flags :MessageFlags.IsComponentsV2});

}   catch (err) {
    return interaction.editReply({
        components:[failureContainer('Schedule Failed','An unexpected error occurred the bot is prob cooked')],
        flags: MessageFlags.IsComponentsV2
})

} 
}  
}
