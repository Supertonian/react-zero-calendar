import axios from 'axios';
import localforage from 'localforage';

async function getHoliday(calendarId: string, apiKey: string, start: string, end: string) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${start}&timeMax=${end}&singleEvents=true&maxResults=9999`;

  const value = await localforage.getItem(url);
  if (value) return value;

  const response = await axios.get(url);
  if (response.status === 200) {
    localforage.setItem(url, response.data);
    return response.data;
  }
  return { items: [] };
}

export { getHoliday };
