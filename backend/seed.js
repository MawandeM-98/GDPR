require('dotenv').config();
const mongoose = require('mongoose');
const Request = require('./models/Request');
const Consent = require('./models/Consent');

const DAY_MS = 24 * 60 * 60 * 1000;
const types = ['access', 'access', 'access', 'correction', 'erasure'];
const names = ['Anna Muller', 'Luca Rossi', 'Sofia Garcia', 'Jan Kowalski', 'Emma Dubois', 'Noah Jansen'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Request.deleteMany({});
  await Consent.deleteMany({});

  const requests = [];
  for (let i = 1; i <= 40; i++) {
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 60) * DAY_MS);
    const dueDate = new Date(createdAt.getTime() + 30 * DAY_MS);
    const roll = Math.random();
    const status = roll < 0.7 ? 'resolved' : roll < 0.85 ? 'in_progress' : 'pending';

    requests.push({
      type: pick(types),
      status,
      requesterName: pick(names),
      requesterEmail: `person${i}@example.com`,
      details: 'Sample request created by seed script',
      createdAt,
      dueDate,
      resolvedAt: status === 'resolved' ? new Date(createdAt.getTime() + 10 * DAY_MS) : undefined,
    });
  }
  await Request.insertMany(requests);

  const grantRates = { marketing: 0.7, cookies: 0.5, analytics: 0.35, third_party: 0.2 };
  const consents = [];
  for (let i = 1; i <= 60; i++) {
    for (const category of Consent.CATEGORIES) {
      consents.push({
        subjectEmail: `subject${i}@example.com`,
        category,
        granted: Math.random() < grantRates[category],
      });
    }
  }
  await Consent.insertMany(consents);

  console.log(`Seeded ${requests.length} requests and ${consents.length} consent records`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});