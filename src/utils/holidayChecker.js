const axios = require('axios');

const isHoliday = async (dateStr, country = 'IN') => {
  const year = new Date(dateStr).getFullYear();
  const url = `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=${country}&year=${year}`;

  try {
    const { data } = await axios.get(url);
    const holidays = data.response.holidays.map(h => h.date.iso);
    return holidays.includes(dateStr);
  } catch (error) {
    console.error('Holiday check failed:', error.message);
    return false;
  }
};

const isWeekend = dateStr => {
  const day = new Date(dateStr).getDay();
  return day === 0 || day === 6;
};

module.exports = {
  isHoliday,
  isWeekend
}