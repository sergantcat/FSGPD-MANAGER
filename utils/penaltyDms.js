const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags
} = require('discord.js');

function penaltyIssuedContainer(penalty, moderator) {
  return new ContainerBuilder()
     .setAccentColor(7667714)
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(" # A Penalty has been Issued")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("**If you belive this is a misstake contact a member of HR**")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(`**Penalty ID:** \`${penalty.penalty_uuid}\`\n**Reason:** ${penalty.reason}\n**Moderator:** <@${moderator.id}>`)
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("-# FSGPD Manager :3")
    );
}

function penaltyDeletedContainer(penalty, moderator) {
  return new ContainerBuilder()
     .setAccentColor(29191)
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("# Penalty Has Been Removed")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("### **Greetings User, A penalty with id displayed Below has been Terminated from the Database.**")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(`**Penalty ID:** \`${penalty.penalty_uuid}\`\n**Original reason:** ${penalty.reason}\n**Terminated by:** <@${moderator.id}>`)
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("-# FSGPD Manager :3")
    );
}

async function sendPenaltyDm(user, container) {
  try {
    await user.send({
      components: [container],
      flags: MessageFlags.IsComponentsV2
    });
  } catch (error) {
    console.error(`Could not DM penalty update to ${user.tag}:`, error.message);
  }
}

module.exports = {
  penaltyIssuedContainer,
  penaltyDeletedContainer,
  sendPenaltyDm
};
