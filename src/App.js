import React from 'react';
import { observable, toJS } from 'mobx';
import { persist } from 'mobx-persist';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import { Checkbox, Hidden } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import useLocalStorage from 'react-use-localstorage';
import { observer } from 'mobx-react-lite';
import { Calendar } from './components/calendar';
import { create } from 'mobx-persist';
import { DateTime } from 'luxon';
import { sidebarStyles } from './styles/sidebar';
import { init as initi18n, changeLanguage } from './i18n/init';
import { useTranslation } from 'react-i18next';

initi18n();
const data = observable({
  maxId: 0,
  events: [],
  categories: [],
});

const schema = {
  maxId: true,
  categories: { type: 'list' },
  events: {
    type: 'list',
    schema: {
      id: true,
      title: true,
      start: true,
      end: true,
      allDay: true,
      display: true,
      place: true,
      forceAllDay: true,
      color: true,
      category: true,
    },
  },
};

const store = persist(schema)(data);

const hydrate = create();
hydrate('zerostrengthCalendar', store);

// actions
function addEvent(event) {
  store.events.push({ ...event, ...{ id: store.maxId } });
  store.maxId += 1;
}
function changeEvent(id, changeInfo) {
  store.events.forEach(item => {
    if (Number(item.id) === Number(id)) {
      const start = DateTime.fromISO(changeInfo.startStr);
      const end = DateTime.fromISO(changeInfo.endStr);
      const isAllDay = (end - start) / (60 * 60 * 1000) >= 24;
      item.start = start.toISO();
      item.end = end.toISO();
      item.allDay = item.forceAllDay || isAllDay;
    }
  });
}
function deleteEvent(id) {
  for (let i = 0; i < store.events.length; i += 1) {
    if (Number(store.events[i].id) === Number(id)) {
      store.events.splice(i, 1);
      return;
    }
  }
}
function addCategory(category) {
  const f = store.categories.filter(item => item === category);
  if (f.length === 0) {
    store.categories.push(category);
    return true;
  }
  return false;
}
function getCategories() {
  return store.categories;
}

const App = observer(() => {
  const classes = sidebarStyles();
  const [state, setState] = React.useState({ left: false });
  const ref = React.createRef(); // calendar ref
  const [title, setTitle] = React.useState('');
  const [viewType, setViewType] = useLocalStorage('calendarViewType', 'dayGridMonth');
  const [lunar, setLunar] = useLocalStorage('calendarLunar', 'false');
  const [focusDate, setFocusDate] = useLocalStorage(
    'calendarFocusDate',
    DateTime.local().toISODate(),
  );
  const [language, setLanguage] = useLocalStorage('calendarLanguage', 'en');
  const { t } = useTranslation();

  React.useEffect(() => {
    changeLanguage(language);
  }, [language]);

  React.useEffect(() => {
    ref.current.getApi().changeView(viewType);
    ref.current.getApi().gotoDate(focusDate);
  }, [ref, focusDate, viewType]);

  const toggleDrawer = (anchor, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handlePrevClick = () => {
    ref.current.getApi().prev();
  };

  const handleNextClick = () => {
    ref.current.getApi().next();
  };

  const handleTodayClick = () => {
    ref.current.getApi().today();
    setFocusDate(DateTime.local().toISODate());
  };

  const handleViewChange = e => {
    setViewType(e.target.value);
  };

  const handleLunarChange = e => {
    setLunar(String(e.target.checked));
  };

  const Sider = anchor => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Hidden smUp>
        <List>
          {[
            [t('month'), 'dayGridMonth'],
            [t('week'), 'timeGridWeek'],
            [t('day'), 'timeGridDay'],
            [t('list'), 'listWeek'],
          ].map((item, index) => (
            <ListItem
              selected={viewType === item[1]}
              button
              key={index}
              onClick={() => setViewType(item[1])}
            >
              {item[0]}
            </ListItem>
          ))}
        </List>
        <Divider />
      </Hidden>
      <List>
        <ListItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={lunar === 'true'}
                onChange={handleLunarChange}
                name="checkedB"
                color="primary"
              />
            }
            label={t('lunar')}
          />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <FormControlLabel
            control={<Checkbox name="default-calendar" color="primary" />}
            label={t('defaultCalendar')}
          />
          </ListItem>
      </List>
      <Divider />
      <List>
        {[
          ['English', 'en'],
          ['Korean', 'ko'],
        ].map((item, index) => (
          <ListItem
            selected={language === item[1]}
            button
            key={index}
            onClick={() => setLanguage(item[1])}
          >
            {item[0]}
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={toggleDrawer('left', true)}
            color="inherit"
            aria-label="open drawer"
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Hidden xsDown>
            <Typography variant="h6" className={classes.title}>
              {t('calendar')}
            </Typography>
            <IconButton
              onClick={handleTodayClick}
              color="inherit"
              aria-label="today-button"
              edge="start"
            >
              {t('today')}
            </IconButton>
            <IconButton
              onClick={handlePrevClick}
              color="inherit"
              aria-label="arrow-left"
              edge="start"
            >
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton
              onClick={handleNextClick}
              color="inherit"
              aria-label="arrow-right"
              edge="start"
            >
              <NavigateNextIcon />
            </IconButton>
          </Hidden>
          <Typography variant="h6" className={classes.yearMonth}>
            {title}
          </Typography>
          <Hidden xsDown>
            <Select
              labelId="language-change-label"
              id="language-change-id"
              value={language}
              onChange={e => {
                setLanguage(e.target.value);
              }}
            >
              <MenuItem value={'en'}>English</MenuItem>
              <MenuItem value={'ko'}>Korean</MenuItem>
            </Select>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={viewType}
              onChange={handleViewChange}
            >
              <MenuItem value={'dayGridMonth'}>월</MenuItem>
              <MenuItem value={'timeGridWeek'}>주</MenuItem>
              <MenuItem value={'timeGridDay'}>일</MenuItem>
              <MenuItem value={'listWeek'}>목록</MenuItem>
            </Select>
          </Hidden>
        </Toolbar>
      </AppBar>
      <React.Fragment>
        <SwipeableDrawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
        >
          {Sider('left')}
        </SwipeableDrawer>
      </React.Fragment>
      <main
        id="calendar-layout"
        style={{ marginTop: '75px', marginLeft: '20px', marginRight: '20px' }}
      >
        <Calendar
          minDurationMinutes={30}
          setter={{ setTitle, setViewType, setFocusDate }}
          lunar={lunar}
          calendarRef={ref}
          locale={language}
          focusDate={focusDate}
          events={store.events}
          changeEvent={changeEvent}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
        />
      </main>
    </div>
  );
});

export default App;
