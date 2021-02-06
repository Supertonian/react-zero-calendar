import React from 'react';
import Calendar from '../components/calendar';

// list of available countries
enum Countries {
  'en.usa',
  'ko.south_korea'
}
// list of available locales
enum Locales {
  'en',
  'ko'
}

export interface Props {
  lunar: boolean,
  holiday: boolean,
  country: Countries,
  locale: Locales,
  events: Array<object>,
  minDurationMinutes: number,
  focusDate: string,
}

/**
 * Calendar UI component for user interaction
 */
export const CalendarUI: React.FC<Props> = (props) => {
  return (
    <Calendar {...props} />
  );
};
