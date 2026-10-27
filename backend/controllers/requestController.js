const Request = require('../models/Request');

// GET /api/requests?status=pending&type=access
exports.getRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const requests = await Request.find(filter).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

// GET /api/requests/:id
exports.getRequestById = async (req, res, next) => {
  try {
    const doc = await Request.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Request not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

// POST /api/requests
exports.createRequest = async (req, res, next) => {
  try {
    const { type, requesterName, requesterEmail, details } = req.body;
    const doc = await Request.create({ type, requesterName, requesterEmail, details });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/requests/:id  (status and/or details)
exports.updateRequest = async (req, res, next) => {
  try {
    const doc = await Request.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Request not found' });

    const { status, details } = req.body;

    if (status !== undefined) {
      doc.status = status;
      doc.resolvedAt = status === 'resolved' ? new Date() : undefined;
    }
    if (details !== undefined) {
      doc.details = details;
    }

    await doc.save();
    res.json(doc);
  } catch (err) {
    next(err);
  }
};