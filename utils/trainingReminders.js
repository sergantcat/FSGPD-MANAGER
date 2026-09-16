const db = require('../db');
const { reminderContainer, postToReminderChannel } = require('./trainingComponents');

function startReminderLoop(client) {
  setInterval(async () => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const windowEnd = now + 10 * 60;

      const due = await db('trainings')
        .where('status', 'Scheduled')
        .andWhere('reminded', false)
        .andWhere('time', '<=', windowEnd)
        .andWhere('time', '>', now);

      for (const training of due) {
        await postToReminderChannel(
          client,
          reminderContainer(training.host, training.id, training.time),
          training.host
        );
        await db('trainings').where({ id: training.id }).update({ reminded: true });
      }
    } catch (err) {
      console.error('Reminder loop error:', err);
    }
  }, 60 * 1000); // check every 60s
}

module.exports = { startReminderLoop };