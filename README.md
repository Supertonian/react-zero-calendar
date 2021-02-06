## Install and Run

### npm

```
npm install react-zero-calendar
```

### yarn

```
yarn add react-zero-calendar
```

### Storybook

[Chromatic](https://601e8e81e1221f002101b10f-wddzdryxjg.chromatic.com/)

#### Basic setting

```
import Calendar from 'react-zero-calendar';

const App = () => {
    return (
        <Calendar locale='ko' />
    );
}
```

#### Add events
```
const App = () => {
    return (
        <Calendar
            locale='ko'
            events={[{title: 'test', start: new Date(), end: new Date()}]}
        />
    );
}
```

#### Set holiday
```
const App = () => {
    return (
        <Calendar
            locale='en' // ko
            country='en.usa' // ko.south_korea
            googleApiKey='YOUR-KEY'
            events={[{title: 'test', start: new Date(), end: new Date()}]}
        />
    );
}
```

#### Event CUD callback
```
const App = () => {
    return (
        <Calendar
            locale='en' // ko
            events={[]}
            addEvent={(event) => console.log(event)}
            changeEvent={(eventId, eventInfo) => console.log(eventId, eventInfo)}
            deleteEvent={(eventId) => console.log(eventId)}
        />
    );
}
```

## Features

- Fetch holiday by Google calendar api
- Show holidays
- Show lunar days
- Change language (en/ko)
- Manage Calendar or category (add/delete)
- addEvent, update, and delete callback
- Store events in local storage (mobx-persist)

## Changelog

[CHANGELOG](https://github.com/ZeroStrength/calendar/blob/master/CHANGELOG.md)

## Demo

https://zerostrength.github.io/react-zero-calendar/
