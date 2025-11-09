const Resignation = require('../models/Resignation.js');
const User = require('../models/User.js')
// const ExitResponse = require('../models/ExitResponse.js');
const { isHoliday, isWeekend } = require('../utils/holidayChecker.js');


const getUserDetails = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select('username email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// submit resignation data
const submitResignation = async (req, res) => {
  const { name, email, jobRole, reason, lwd } = req.body;
  const country = 'IN';

  if (!name || !email || !jobRole || !reason || !lwd) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if LWD is weekend or holiday
  if (isWeekend(lwd) || await isHoliday(lwd, country)) {
    return res.status(400).json({ message: 'LWD cannot be a weekend or holiday.' });
  }

  try {
    const resignation = await Resignation.create({
      employeeId: req.user.id,
      name,
      email,
      jobRole,
      reason,
      lwd,
    });

    res.status(201).json({
      message: 'Resignation submitted successfully.',
      data: { resignation: { _id: resignation._id } },
    });
  } catch (err) {
    console.error('Resignation submission failed:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// check status of resignation application
const resignationStatus = async (req, res) => {
  try {
    const resignation = await Resignation.findOne({ employeeId: req.user.id });
    res.json({ data: resignation });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resignation details.' });
  }
};


module.exports = {
getUserDetails,
  submitResignation,
  resignationStatus
}