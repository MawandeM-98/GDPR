const Request = require('../models/Request');
const Consent = require('../models/Consent');

// GET /api/dashboard/stats
exports.getStats = async (req, res, next) => {
  try {
    const now = new Date();

    const [total, pending, resolved, overdue, byType, grantedByCategory] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: { $ne: 'resolved' } }),
      Request.countDocuments({ status: 'resolved' }),
      Request.countDocuments({ status: { $ne: 'resolved' }, dueDate: { $lt: now } }),
      Request.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
      Consent.aggregate([
        { $match: { granted: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
    ]);

    const requestTypes = { access: 0, correction: 0, erasure: 0 };
    byType.forEach((t) => {
      requestTypes[t._id] = t.count;
    });

    const consent = { marketing: 0, cookies: 0, analytics: 0, third_party: 0 };
    grantedByCategory.forEach((c) => {
      consent[c._id] = c.count;
    });

    // Compliance score = share of requests that are not past their deadline
    const complianceScore = total === 0 ? 100 : Math.round(((total - overdue) / total) * 100);

    res.json({
      totalRequests: total,
      pendingRequests: pending,
      resolvedRequests: resolved,
      overdueRequests: overdue,
      complianceScore,
      requestTypes,
      consent,
    });
  } catch (err) {
    next(err);
  }
};