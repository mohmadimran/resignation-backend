const Resignation = require('../models/Resignation.js');
const ExitResponse = require('../models/ExitResponse.js');
const { isHoliday, isWeekend } = require('../utils/holidayChecker.js');

 const submitResignation = async (req, res) => {
  const { lwd } = req.body;
  const country = 'IN';

  if (isWeekend(lwd) || await isHoliday(lwd, country)) {
    return res.status(400).json({ message: 'LWD cannot be a weekend or holiday' });
  }

  try {
    const resignation = await Resignation.create({ employeeId: req.user.id, lwd });
    res.json({ data: { resignation: { _id: resignation._id } } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 const submitExitResponses = async (req, res) => {
  try {
    await ExitResponse.create({ employeeId: req.user.id, responses: req.body.responses });
    res.status(200).json({ message: 'Responses submitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  submitResignation,
  submitExitResponses
}