import axios from 'axios';

function getHoliday(calendarId, apiKey, start, end) {
  return axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${start}&timeMax=${end}&singleEvents=true&maxResults=9999`,
  );
}

export { getHoliday };
