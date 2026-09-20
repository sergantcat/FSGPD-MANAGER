const { SlashCommandBuilder } = require('discord.js');
const db = require('../db');
const { successContainer, failureContainer, hasHostRole, trainingCancelContainer, postToChannel, MessageFlags, trainingConcludeContainer, trainingTimeChangeContainer, trainingStartContainer } = require('../utils/trainingComponents');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('training')
    .setDescription('Manage an existing training')
    .addSubcommand(sub =>
      sub.setName('cancel').setDescription('Cancel a training')
        .addStringOption(o => o.setName('training').setDescription('Training').setRequired(true).setAutocomplete(true))
        .addStringOption(o => o.setName('reason').setDescription('Reason').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('changetime').setDescription('Change training time')
        .addStringOption(o => o.setName('training').setDescription('Training').setRequired(true).setAutocomplete(true))
        .addIntegerOption(o => o.setName('newtime').setDescription('New Unix timestamp').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('start').setDescription('Start a training')
        .addStringOption(o => o.setName('training').setDescription('Training').setRequired(true).setAutocomplete(true))
        .addStringOption(o => o.setName('type').setDescription('Server type').setRequired(true)
          .addChoices({ name: 'Private server', value: 'private' }, { name: 'Public', value: 'public' }))
        .addStringOption(o => o.setName('link').setDescription('Private server link (required if Private)')))
    .addSubcommand(sub =>
      sub.setName('conclude').setDescription('Conclude a training')
        .addStringOption(o => o.setName('training').setDescription('Training').setRequired(true).setAutocomplete(true))),

  async autocomplete(interaction) {
    const sub = interaction.options.getSubcommand();
    const focused = interaction.options.getFocused();
    const statusFilter = sub === 'conclude' ? 'Started' : 'Scheduled';

    const rows = await db('trainings')
      .where('status', statusFilter)
      .andWhere('host', 'ilike', `%${focused}%`)
      .limit(25);

    await interaction.respond(rows.map(r => ({ name: `${r.host} — ${r.time}`, value: r.id })));
  },

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (!hasHostRole(interaction.member)) {
      return interaction.reply({
        components: [failureContainer('Permission Denied', 'You do not have the required role to manage trainings.')],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply();

    try {
      if (sub === 'cancel') {
        const id = interaction.options.getString('training');
        const reason = interaction.options.getString('reason');
        const updated = await db('trainings').where({ id }).update({ status: 'Cancelled', cancel_reason: reason });
        if (!updated) return interaction.editReply({ components: [failureContainer('Cancel Failed', 'Could not find that training.')], flags: MessageFlags.IsComponentsV2 });

        const desc = '';
        await postToChannel(interaction.client, trainingCancelContainer(interaction.user.id, id, reason));
        return interaction.editReply({ components: [successContainer('Training Cancelled', desc)], flags: MessageFlags.IsComponentsV2 });
      }

      if (sub === 'timechange') {
        const id = interaction.options.getString('training');
        const newtime = interaction.options.getInteger('newtime');
        if (newtime * 1000 < Date.now()) return interaction.editReply({ components: [failureContainer('Time Change Failed', 'That Unix timestamp is in the past.')], flags: MessageFlags.IsComponentsV2 });

        const updated = await db('trainings').where({ id }).update({ time: newtime, reminded: false });
        if (!updated) return interaction.editReply({ components: [failureContainer('Time Change Failed', 'Could not find that training.')], flags: MessageFlags.IsComponentsV2 });

        const desc = '';
        await postToChannel(interaction.client, trainingTimeChangeContainer(id, newtime));
        return interaction.editReply({ components: [successContainer('Training Time Changed', desc)], flags: MessageFlags.IsComponentsV2 });
      }

      if (sub === 'start') {
        const id = interaction.options.getString('training');
        const type = interaction.options.getString('type');
        const link = interaction.options.getString('link');
        if (type === 'private' && !link) return interaction.editReply({ components: [failureContainer('Start Failed', 'Private server trainings require a `link` option.')], flags: MessageFlags.IsComponentsV2 });

        const containerType = type === 'private' ? 1 : 2;
        const updated = await db('trainings').where({ id }).update({ status: 'Started', server_type: type, link: link || null });
        if (!updated) return interaction.editReply({ components: [failureContainer('Start Failed', 'Could not find that training.')], flags: MessageFlags.IsComponentsV2 });

        const desc = '';
        await postToChannel(interaction.client, trainingStartContainer(id, type, link));
        return interaction.editReply({ components: [successContainer('Training Started', desc)], flags: MessageFlags.IsComponentsV2 });
      }

      if (sub === 'conclude') {
        const id = interaction.options.getString('training');
        const updated = await db('trainings').where({ id }).update({ status: 'Concluded' });
        if (!updated) return interaction.editReply({ components: [failureContainer('Conclude Failed', 'Could not find that training.')], flags: MessageFlags.IsComponentsV2 });

        const desc = '';
        await postToChannel(interaction.client, trainingConcludeContainer(id));
        return interaction.editReply({ components: [successContainer('Training Concluded', desc)], flags: MessageFlags.IsComponentsV2 });
      }
    } catch (err) {
      console.error(err);
      return interaction.editReply({
        components: [failureContainer(`${sub[0].toUpperCase()}${sub.slice(1)} Failed`, 'An unexpected error occurred.')],
        flags: MessageFlags.IsComponentsV2
      });
    }
  }
};