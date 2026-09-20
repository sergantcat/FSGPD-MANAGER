const { SlashCommandBuilder,
     PermissionFlagsBits, 
     ContainerBuilder,
     TextDisplayBuilder,
     SeparatorBuilder,
     SeparatorSpacingSize,
    MessageFlags,
    Message} = require('discord.js')
    const { randomUUID } = require('crypto')
    const knex = require('../db')
    const {
        penaltyIssuedContainer,
        penaltyDeletedContainer,
        sendPenaltyDm
    } = require('../utils/penaltyDms')

    module.exports = {
        data: new SlashCommandBuilder()
        .setName('penalties')
        .setDescription('Manage Users Penalties')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand( sub => 
            sub
            .setName('add')
            .setDescription('Issue a Penalty on a User')
            .addUserOption(o=>
                o
                .setName('user')
                .setDescription('Target User')
                .setRequired(true)            
               
            )
            .addStringOption(o=>
                o
                    .setName('reason')
                    .setDescription('Reason of the Penalty')
                    .setRequired(true)
                )
            
        )
        .addSubcommand(sub =>
            sub
            .setName('fetch')
            .setDescription('Fetch Penalties')
            .addUserOption(o=>
                o
                .setName('user')
                .setDescription('User to fetch penalties for.')
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
            sub
            .setName('delete')
            .setDescription('Terminate a Penalty From the Database')
            .addStringOption(o =>
                o
                .setName('id')
                .setDescription('Penalty ID to Terminate From Db')
                .setRequired(true)
            )
        ),

        async execute(interaction) {
            const sub = interaction.options.getSubcommand();
            await interaction.deferReply({
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });

            if(sub === 'add') {
                const user = interaction.options.getUser('user')
                const reason = interaction.options.getString('reason')

                const[penalty] = await knex('penalties')
                .insert({
                    penalty_uuid: randomUUID(),
                    user_id: user.id,
                    moderator_id: interaction.user.id,
                    reason,
                    created_at: new Date(),
                }) 
                .returning('*');

                await sendPenaltyDm(
                    user,
                    penaltyIssuedContainer(penalty, interaction.user)
                );

                const container = new ContainerBuilder()
                  .setAccentColor(7472132)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                    .setContent(
                        `**Succesfully Issued a Penalty #${penalty.penalty_uuid} to ${user.tag}**\nReason: ${reason}`
                    )
                );

                return interaction.editReply({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                });
            }
            
            if(sub === 'fetch') {
                 const user = interaction.options.getUser('user')
                      const penalties = await knex('penalties')
                          .where({ user_id: user.id })
                          .orderBy('created_at', 'desc');

                      const container = new ContainerBuilder();

                 if(penalties.length === 0) {
                    
                    container
                    .setAccentColor(7472132)
                    .addTextDisplayComponents(
                     new TextDisplayBuilder()
                    
                    .setContent(`###  **No Penalties have been found for  ${user.tag}**\n`)
                    )

                 } else {
                    container
                    .setAccentColor(7472132)
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                        .setContent(` # **Penalties for ${user.tag}** (Total Penalties: ${penalties.length})`)
                    );

                    penalties.forEach((p) => {
                        container.addSeparatorComponents(
                            new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Large)
                        );
                        container.addTextDisplayComponents(
                            new TextDisplayBuilder()
                            .setContent(`**${p.penalty_uuid}** - ${p.reason}\nModerator: <@${p.moderator_id}> • <t:${Math.floor(new Date(p.created_at).getTime() / 1000)}:R>`)
                        );
                    }
                    
                    
                )
                
                } return interaction.editReply({
                    components: [container],
                    flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                });

            }
             if (sub === 'delete') {
    const id = interaction.options.getString('id');
 
    const penalty = await knex('penalties').where({ penalty_uuid: id }).first();
 
      const container = new ContainerBuilder();
 
      if (!penalty) {
        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`No penalty found with ID #${id}.`)
        );
      } else {
        await knex('penalties').where({ penalty_uuid: id }).del();

                try {
                    const user = await interaction.client.users.fetch(penalty.user_id);
                    await sendPenaltyDm(
                        user,
                        penaltyDeletedContainer(penalty, interaction.user)
                    );
                } catch (error) {
                    console.error('Could not fetch user for penalty deletion DM:', error.message);
                }

        container.addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`Penalty #${id} deleted (was: "${penalty.reason}").`)
        );
      }
 
            return interaction.editReply({
                components: [container],
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            });
    }
  },
};
                
        

    


