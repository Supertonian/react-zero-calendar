## Install and Run

### npm

```
npm install react-zero-calendar
```

### yarn

```
yarn add react-zero-calendar
```

#### Basic setting

```
import Calendar from 'react-zero-calendar';

const App = () => {
    return (
        <Calendar
            locale='ko'
        />
    );
}
```

#### Add events
```
import Calendar from 'react-zero-calendar';

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
import Calendar from 'react-zero-calendar';

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

## Features

- Fetch holiday by Google calendar api
- Show holidays
- Show lunar days
- Change language (en/ko)
- Manage Calendar or category (add/delete)
- Store events in local storage (mobx-persist)

## Changelog

[CHANGELOG](https://github.com/ZeroStrength/calendar/blob/master/CHANGELOG.md)

## Demo

http://zerostrength.github.io/calendar/
