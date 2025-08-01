const Resignation = require('../models/Resignation.js');
const ExitResponse = require('../models/ExitResponse.js');
const User = require('../models/User.js');
const { sendEmail } = require('../utils/mailer.js');

const getAllResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find();
    res.json({ data: resignations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const concludeResignation = async (req, res) => {
  const { resignationId, approved, lwd } = req.body;

  try {
    // 1. Update resignation status
    const resignation = await Resignation.findByIdAndUpdate(
      resignationId,
      { status: approved ? 'approved' : 'rejected', lwd },
      { new: true }
    ).populate('employeeId', 'email');

    // 2. If employee email missing, skip email but still return success
    if (!resignation || !resignation.employeeId || !resignation.employeeId.email) {
      console.warn("Employee email not found, skipping notification");
      return res.status(200).json({
        success: true,
        message: `Resignation ${approved ? 'approved' : 'rejected'}`,
        warning: 'Notification skipped (email not found)',
        data: resignation
      });
    }

    // 3. Compose and send email
    const subject = approved ? 'Resignation Approved' : 'Resignation Rejected';
    const text = approved
      ? `Your resignation has been approved. Last working day: ${lwd}`
      : 'Your resignation has been rejected.';

    await sendEmail({ to: "test@example.com", subject, text }); // or use resignation.employeeId.email

    res.json({
      success: true,
      message: `Resignation ${approved ? 'approved' : 'rejected'}`,
      data: resignation
    });

  } catch (err) {
    console.error('Approval Error:', err);
    res.status(200).json({
      success: true,
      message: `Resignation ${approved ? 'approved' : 'rejected'}`,
      warning: 'Approved but notification failed',
      error: err.message
    });
  }
};


 const getExitResponses = async (req, res) => {
  try {
    const responses = await ExitResponse.find();
    res.json({ data: responses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
getAllResignations,
concludeResignation,
getExitResponses,
};
