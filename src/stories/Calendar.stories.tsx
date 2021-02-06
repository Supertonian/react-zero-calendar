import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import { Props, CalendarUI as Calendar } from './Calendar';

export default {
  title: 'Example/Calendar',
  component: Calendar,
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} as Meta;

const Template: Story<Props> = (args) => <Calendar {...args} />;

// setter,
// calendarRef,
// locale,
// lunar,
// holiday,
// country,
// minDurationMinutes,
// slotDuration,
// focusDate,
// events,
// addEvent,
// changeEvent,
// deleteEvent,
// editEvent,
// categoryList,
// googleApiKey,
// selectLongPressDelay,

export const View = Template.bind({});
View.args = {
  lunar: true,
  holiday: true,
  country: 'en.usa',
  googleApiKey: '',
  locale: 'en',
  minDurationMinutes: 30,
};

export const Event = Template.bind({});
Event.args = {
  focusDate: '2021-01-01',
  events: [{start: new Date(), end: new Date(), title: 'hi', allDay: true}],
};
