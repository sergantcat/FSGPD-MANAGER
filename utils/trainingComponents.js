const {
  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder,
  SeparatorSpacingSize, MessageFlags
} = require('discord.js');

function successContainer(title, description) {
  return new ContainerBuilder()
    .setAccentColor(0x57F287)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ✅ ${title}\n${description}`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Training system • <t:${Math.floor(Date.now() / 1000)}:R>`));
}

function failureContainer(title, description) {
  return new ContainerBuilder()
    .setAccentColor(0xED4245)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ❌ ${title}\n${description}`))
    .addSeparatorComponents(new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent('-# If this keeps happening, contact staff.'));
}

function reminderContainer(hostId, id, time) {
  return new ContainerBuilder()
    .setAccentColor(0xFEE75C)
    .addTextDisplayComponents(new TextDisplayBuilder().setContent(
      `## ⏰ Training Starting Soon\n<@${hostId}>, your training starts <t:${time}:T>.\nID: \`${id}\``
    ));
}
function trainingContainer(hostId, id, time){
  return new ContainerBuilder()
  .setAccentColor(3293864)
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("# An FSGPD Training Has Been Scheduled")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("> React with ✅ to attend\n\n")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("## Training Information\nTrainings Are events that are being hosted by leadership and Junior Instr  +\nthey are designed to help you gain skills and ability tom defend the Institute from Rebelion Syndicate.\n")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("## Training Guidelines\n* Act Mature\n* Act Respectfull\n* Follow the FSGPD Guidelines\n")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
      .setContent(`Training Time : <t:${time}:T>\nTraining Host : <@${hostId}>\nTraining Id : \`${id}\``)
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("-# <@&1549476815653838918>\n-# FSGPD Manager :3")
    );
  
}
function trainingCancelContainer(hostId, id, reason) {
  return new ContainerBuilder()
    .setAccentColor(8717059)
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("# Training Session Canceled")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("The training session with id mentioned below was canceled by its host.")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
      .setContent(`Host :  <@${hostId}>\nTraining ID :  \`${id}\`\nReason : ${reason}\n`)
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("- <@&1549476815653838918>\n-# FSGPD Manager :3")
    );
}

function trainingConcludeContainer (id) {
  return new ContainerBuilder()
    .setAccentColor(290080)
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("# Training Session Concluded")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("Training session with ID stated below was concluded by the host ")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(`Training ID : \`${id}\`  `)
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
      .setContent("<@&1549476815653838918>\n-# FSGPD Manager :3")
    );

}
function trainingTimeChangeContainer (id,newtime) {
  return new ContainerBuilder()
    .setAccentColor(6711299)
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("# Training Session Time changed")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("Training Session with ID mentioned below time has been changed by its host")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(`ID: \`${id}\`\nNew Time: <t:${newtime}:F>`)
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("<@&1549476815653838918>\n-# FSGPD Manager :3")
    );
}

function trainingStartContainer(id, type, link) {
  const serverType = type === 'private' ? 'Private' : 'Public';
  const linkLine = link ? `\nServer Link: ${link}` : '';

  return new ContainerBuilder()
  .setAccentColor(1245439)
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("# Training Session Starting")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("Training mentioned below is now starting, please Join.")
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent(`Training ID: \`${id}\`\nServer Type: ${serverType}${linkLine}`)
    )
    .addSeparatorComponents((separator) => separator
        .setDivider(true)
        .setSpacing(SeparatorSpacingSize.Large)
    )
    .addTextDisplayComponents((textDisplay) => textDisplay
        .setContent("<@&1549476815653838918>\n-# FSGPD Manager :3")
    );
    
}

function hasHostRole(member) {
  const roleIds = (process.env.TRAINING_HOST_ROLE_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
  return member.roles.cache.some(r => roleIds.includes(r.id));
}

async function postToChannel(client, container) {
  const channel = await client.channels.fetch(process.env.TRAINING_CHANNEL_ID);
  return channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
}

async function postToReminderChannel(client, container, hostId) {
  const channel = await client.channels.fetch(process.env.TRAINING_REMINDER_CHANNEL_ID);
  return channel.send({
    components: [container],
    flags: MessageFlags.IsComponentsV2
  });
}

module.exports = {
  successContainer, failureContainer, trainingContainer, trainingCancelContainer, trainingConcludeContainer, trainingTimeChangeContainer, trainingStartContainer, reminderContainer,
  hasHostRole, postToChannel, postToReminderChannel, MessageFlags
};