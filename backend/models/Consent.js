const mongoose = require('mongoose');

const CATEGORIES = ['marketing', 'cookies', 'analytics', 'third_party'];

const consentSchema = new mongoose.Schema(
  {
    subjectEmail: { type: String, required: true, trim: true, lowercase: true },
    category: { type: String, enum: CATEGORIES, required: true },
    granted: { type: Boolean, required: true },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One record per person per category; changing consent updates that record
consentSchema.index({ subjectEmail: 1, category: 1 }, { unique: true });

const Consent = mongoose.model('Consent', consentSchema);
Consent.CATEGORIES = CATEGORIES;

module.exports = Consent;