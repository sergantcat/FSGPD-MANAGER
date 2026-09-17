const{SlashCommandBuilder,PermissionFlags,ContainerBuilder,SeparatorBuilder,SeparatorSpacingSize,TextDisplayBuilder, PermissionFlagsBits,} = require('discord.js')

const db = require('../db')
const PENALTY_PERMISSION_ROLE_IDS = process.env.PENALTY_PERMISSION_ROLE_IDS



module.exports = {
     data: new SlashCommandBuilder()
     .setName('penalty-issue')
     .setDescription('[MR] allows to issue a penalty (strike).')
     .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addSubcommand( sub =>
            sub
            .setName('find-enalties')
            .setDescription('efwh')
        ),

      async execute(interaction) {
 const roleIds = process.env.PENALTY_PERMISSION_ROLE_IDS
  .split(',')
  .map(id => id.trim());

  if (
    !interaction.memberPermissions.has(PermissionFlagsBits.BanMembers) ||
    !interaction.member.roles.cache.some(role => roleIds.includes(role.id))
  ) {
    return interaction.reply({
      content: 'You do not have permission to use this command.',
      ephemeral: true
    });
  }
  }
}

