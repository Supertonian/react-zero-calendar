import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CalendarStore from './stores/calendarStore';
import * as serviceWorker from './serviceWorker';

const calendarStore = new CalendarStore();

ReactDOM.render(
  <React.StrictMode>
    <App store={calendarStore} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
