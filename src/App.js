import React from 'react';
import { observable } from 'mobx';
import { persist, create } from 'mobx-persist';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import { Button, Checkbox, Hidden } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import useLocalStorage from 'react-use-localstorage';
import { observer } from 'mobx-react-lite';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import Calendar from './components/calendar';
import { sidebarStyles } from './styles/sidebar';
import { init as initi18n, changeLanguage } from './i18n/init';
import { randomChoice } from './utils/etc';
import CustomizedMenus from './components/customizedMenu';
import AlertDialog, { ColorPicker } from './components/confirm';

initi18n();
const data = observable({
  maxId: 0,
  events: [],
  categories: [],
});

const schema = {
  maxId: true,
  categories: { type: 'list', schema: { name: true, show: true, color: true } },
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
      importance: true,
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
function editEvent(id, editInfo) {
  for (let i = 0; i < store.events.length; i += 1) {
    if (Number(store.events[i].id) === Number(id)) {
      store.events[i].title = editInfo.title;
      store.events[i].startStr = editInfo.startStr;
      store.events[i].endStr = editInfo.endStr;
      store.events[i].place = editInfo.place;
      store.events[i].importance = editInfo.importance;
    }
  }
}
const palette = {
  IndianRed: '#CD5C5C',
  Crimson: '#DC143C',
  Tomato: '#FF6347',
  Gold: '#FFD700',
  Magenta: '#FF00FF',
  RebeccaPurple: '#663399',
  Indigo: '#4B0082',
  Lime: '#00FF00',
  ForestGreen: '#228B22',
  SaddleBrown: '#8B4513',
};

function addCategory(categoryName) {
  const f = store.categories.filter(item => item.name === categoryName);
  if (f.length === 0) {
    const paletteKeys = Object.keys(palette);
    const colorName = randomChoice(paletteKeys);
    store.categories.push({ name: categoryName, show: true, color: palette[colorName] });
    return true;
  }
  return false;
}

function deleteCategory(categoryName) {
  // delete category
  const newCategoryList = store.categories.filter(item => item.name !== categoryName);
  store.categories = newCategoryList;

  // delete events with this category
  const newEvents = store.events.filter(item => item.category !== categoryName);
  store.events = newEvents;
}

function changeCategoryColor(categoryName, color) {
  // change category color
  let i = 0;
  for (; i < store.categories.length; i += 1) {
    if (store.categories[i].name === categoryName) {
      break;
    }
  }
  const newObj = { ...store.categories[i], ...{ color } };
  store.categories.splice(i, 1, newObj);

  // TODO: change events' calendar color
}

function filterEvents(events) {
  if (store.categories.length === 0) addCategory('default');
  const categoriesToShow = store.categories.filter(item => item.show === true);
  const categoryList = categoriesToShow.map(item => item.name);

  const newEvents = events
    .filter(item => categoryList.includes(item.category))
    .map(item => {
      return {
        ...item,
        ...{
          backgroundColor: item.color,
          tagColor: store.categories.find(a => a.name === item.category).color || 'black',
        },
      };
    });
  return newEvents;
}

const App = observer(() => {
  const classes = sidebarStyles();
  const [state, setState] = React.useState({ left: false });
  const ref = React.createRef(); // calendar ref
  const [title, setTitle] = React.useState('');
  const [viewType, setViewType] = useLocalStorage('calendarViewType', 'dayGridMonth');
  const [lunar, setLunar] = useLocalStorage('calendarLunar', 'false');
  const [holiday, setHoliday] = useLocalStorage('calendarHoliday', 'true');
  const [focusDate, setFocusDate] = useLocalStorage(
    'calendarFocusDate',
    DateTime.local().toISODate(),
  );
  const [language, setLanguage] = useLocalStorage('calendarLanguage', 'en');
  const [alert, setAlert] = React.useState({ open: false });
  const [colorPopup, setColorPopup] = React.useState({ open: false });
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

  const handleHolidayChange = e => {
    setHoliday(String(e.target.checked));
  };

  const handleCategoryChange = (e, name) => {
    const { checked } = e.target;
    const target = store.categories.filter(item => item.name === name);
    if (target.length === 1) {
      target[0].show = checked;
    }
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
                name="lunar_check"
                color="primary"
              />
            }
            label={t('lunar')}
          />
        </ListItem>
        <ListItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={holiday === 'true'}
                onChange={handleHolidayChange}
                name="holiday_check"
                color="primary"
              />
            }
            label={t('holiday')}
          />
        </ListItem>
      </List>
      <Divider />
      <List>
        {store.categories.map(category => (
          <ListItem key={category.name}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={category.show}
                  name={category.name}
                  onChange={e => handleCategoryChange(e, category.name)}
                  style={{
                    color: category.color || 'black',
                  }}
                />
              }
              label={category.name === 'default' ? t('defaultCalendar') : category.name}
            />
            <CustomizedMenus
              t={t}
              handleDelete={() => {
                if (category.name === 'default') {
                  setAlert({
                    open: true,
                    title: t('Information'),
                    content: t('INFO-DEFAULT-CALENDAR-DELETE'),
                    okText: t('Ok'),
                    handleOkClick: () => {},
                  });
                } else {
                  setAlert({
                    open: true,
                    title: t('DELETE-CALENDAR'),
                    content: t('ASK-PROMPT-DELETE'),
                    okText: t('Delete'),
                    cancelText: t('Cancel'),
                    handleOkClick: () => deleteCategory(category.name),
                  });
                }
              }}
              handleColorChange={() => {
                setColorPopup({
                  open: true,
                  title: t('SELECT-COLOR'),
                  initialColor: category.color,
                  okText: t('Ok'),
                  cancelText: t('Cancel'),
                  handleOkClick: color => {
                    changeCategoryColor(category.name, color);
                  },
                });
              }}
            />
          </ListItem>
        ))}
        <ListItem>
          <Button
            onClick={() => {
              const name = prompt(t('enter-new-category'));
              if (name.trim() !== '') {
                if (name.trim() === 'default') {
                  setAlert({
                    open: true,
                    title: t('CANNOT-CREATE-DEFAULT-NAME'),
                    okText: t('Ok'),
                    handleOkClick: () => {},
                  });
                } else {
                  addCategory(name.trim());
                }
              }
            }}
          >
            + {t('newCalendar')}
          </Button>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>{t('importCalendar')}</ListItem>
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
    <>
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
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ko">Korean</MenuItem>
            </Select>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={viewType}
              onChange={handleViewChange}
            >
              <MenuItem value="dayGridMonth">월</MenuItem>
              <MenuItem value="timeGridWeek">주</MenuItem>
              <MenuItem value="timeGridDay">일</MenuItem>
              <MenuItem value="listWeek">목록</MenuItem>
            </Select>
          </Hidden>
        </Toolbar>
      </AppBar>
      <>
        <SwipeableDrawer
          anchor="left"
          open={state.left}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
        >
          {Sider('left')}
        </SwipeableDrawer>
      </>
      <main style={{ marginTop: '75px', marginLeft: '20px', marginRight: '20px' }}>
        <Calendar
          minDurationMinutes={30}
          setter={{ setTitle, setViewType, setFocusDate }}
          lunar={lunar === 'true'}
          holiday={holiday === 'true'}
          calendarRef={ref}
          locale={language}
          focusDate={focusDate}
          events={filterEvents(store.events)}
          categoryList={store.categories.map(item => item.name)}
          changeEvent={changeEvent}
          addEvent={addEvent}
          deleteEvent={deleteEvent}
          editEvent={editEvent}
          googleApiKey="AIzaSyCWLalUqC46xX50wv6oBZiDUjWN4nJnAoE"
          country="en.usa"
          selectLongPressDelay={1000}
        />
      </main>
      <AlertDialog
        open={alert.open}
        title={alert.title}
        content={alert.content}
        okText={alert.okText}
        cancelText={alert.cancelText}
        handleOkClick={() => {
          alert.handleOkClick();
          setAlert({ ...alert, ...{ open: false } });
        }}
        handleClose={() => {
          setAlert({ ...alert, ...{ open: false } });
        }}
      />
      <ColorPicker
        palette={palette}
        open={colorPopup.open}
        title={colorPopup.title}
        okText={colorPopup.okText}
        cancelText={colorPopup.cancelText}
        handleOkClick={color => {
          colorPopup.handleOkClick(color);
          setColorPopup({ ...colorPopup, ...{ open: false } });
        }}
        handleClose={() => {
          setColorPopup({ ...colorPopup, ...{ open: false } });
        }}
        initialColor={colorPopup.initialColor}
      />
    </>
  );
});

export default App;
