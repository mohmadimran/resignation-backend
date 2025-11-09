const Resignation = require('../models/Resignation.js');
const ExitResponse = require('../models/ExitResponse.js');
const { sendEmail } = require('../utils/mailer.js');


const getAllResignations = async (req, res) => {
  try {
    // Fetch all resignations and include basic user info from the User collection
    const resignations = await Resignation.find()
      .populate('employeeId', 'name email jobRole') 
      .sort({ createdAt: -1 }); 

    if (!resignations || resignations.length === 0) {
      return res.status(404).json({ message: 'No resignation requests found.' });
    }

    res.status(200).json({
      message: 'Resignation requests fetched successfully.',
      data: resignations,
    });
  } catch (err) {
    console.error('Error fetching resignations:', err);
    res.status(500).json({ message: 'Failed to fetch resignation requests.' });
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

    if (!resignation || !resignation.employeeId || !resignation.employeeId.email) {
      console.warn("Employee email not found, skipping notification");
      return res.status(200).json({
        success: true,
        message: `Resignation ${approved ? 'approved' : 'rejected'}`,
        warning: 'Notification skipped (email not found)',
        data: resignation
      });
    }

    const subject = approved ? 'Resignation Approved' : 'Resignation Rejected';
    const text = approved
      ? `Your resignation has been approved. Last working day: ${lwd}`
      : 'Your resignation has been rejected.';

    await sendEmail({ to: "test@example.com", subject, text }); 

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
