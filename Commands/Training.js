const {
    SlashCommandBuilder,
    ContainerBuilder,
    SeparatorBuilder,
    TextDisplayBuilder,
    Colors,
    MessageFlags,
    AttachmentBuilder
} = require("discord.js");

const {randomUUID} = require("crypto"); //This generates the Training id

const trainingId = randomUUID(); // This declares the randomUUID as trainingid

const TRAINING_CHANNNEL_ID = process.env.TRAINING_CHANNNEL_ID

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
        .setDescription("Run the training command for approved hosts."),

}