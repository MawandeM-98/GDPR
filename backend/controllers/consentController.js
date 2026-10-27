const Consent = require('../models/Consent');

// GET /api/consents
exports.getConsents = async (req, res, next) => {
  try {
    const consents = await Consent.find().sort({ recordedAt: -1 });
    res.json(consents);
  } catch (err) {
    next(err);
  }
};

// POST /api/consents  { subjectEmail, category, granted }
// Creates the record, or updates it if that person already has one for the category
exports.upsertConsent = async (req, res, next) => {
  try {
    const { subjectEmail, category, granted } = req.body;

    if (!subjectEmail || typeof granted !== 'boolean' || !Consent.CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: `Provide subjectEmail, granted (true/false) and category (${Consent.CATEGORIES.join(', ')})`,
      });
    }

    const doc = await Consent.findOneAndUpdate(
      { subjectEmail: subjectEmail.toLowerCase(), category },
      { granted, recordedAt: new Date() },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};