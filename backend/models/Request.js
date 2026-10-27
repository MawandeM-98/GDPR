const mongoose = require('mongoose');

const DAY_MS = 24 * 60 * 60 * 1000;

const requestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['access', 'correction', 'erasure'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending',
    },
    requesterName: { type: String, required: true, trim: true },
    requesterEmail: { type: String, required: true, trim: true, lowercase: true },
    details: { type: String, trim: true, default: '' },
    // GDPR: respond within one month, so default the deadline to 30 days out
    dueDate: { type: Date, default: () => new Date(Date.now() + 30 * DAY_MS) },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);