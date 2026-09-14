const {
  SlashCommandBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ContainerBuilder,
  Colors,
  PermissionFlagsBits,
  MessageFlags
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reboot")
    .setDescription("Reboots the bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const rebootContainer = new ContainerBuilder()
      .setAccentColor(Colors.Green)
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent("## Rebooting the bot...")
      )
      .addSeparatorComponents(new SeparatorBuilder())
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`Bot is restarting now. ${interaction.client.user?.username || "Bot"}`)
      );

    await interaction.reply({
      components: [rebootContainer],
      flags: MessageFlags.IsComponentsV2
    });

    setTimeout(() => {
      process.exit(0);
    }, 1500);
  }
};