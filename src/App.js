import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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
import SettingsIcon from '@material-ui/icons/Settings';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import { Checkbox, Hidden } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import useLocalStorage from 'react-use-localstorage';
import { observer } from 'mobx-react-lite';
import { zerostrengthCalendar, Calendar } from './components/calendar';
import { create } from 'mobx-persist';

const hydrate = create();
hydrate('zerostrengthCalendar', zerostrengthCalendar);

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  root: {
    display: 'flex',
  },
  title: {
    marginRight: '25px',
  },
  yearMonth: {
    flexGrow: 1,
  },
}));

const App = observer(() => {
  const classes = useStyles();
  const [state, setState] = React.useState({ left: false });
  const ref = React.createRef(); // calendar ref
  const [title, setTitle] = React.useState('');
  const [viewType, setViewType] = useLocalStorage('calendarViewType', 'dayGridMonth');
  const [lunar, setLunar] = useLocalStorage('calendarLunar', 'false');

  React.useEffect(() => {
    ref.current.getApi().changeView(viewType);
  }, [ref, viewType]);

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
            ['월', 'dayGridMonth'],
            ['주', 'timeGridWeek'],
            ['일', 'timeGridDay'],
            ['목록', 'listWeek'],
          ].map((item, index) => (
            <ListItem selected={viewType === item[1]} button key={index} onClick={() => setViewType(item[1])}>
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
              <Checkbox checked={lunar === 'true'} onChange={handleLunarChange} name="checkedB" color="primary" />
            }
            label="음력"
          />
        </ListItem>
      </List>
      <Divider />
      <List>
        {['내 캘린더', '캘린더1', '캘린더2'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
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
              캘린더
            </Typography>
            <IconButton
              onClick={handleTodayClick}
              color="inherit"
              aria-label="today-button"
              edge="start"
            >
                오늘
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
            <IconButton color="inherit" aria-label="user-setting" edge="start">
              <SettingsIcon />
            </IconButton>
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
      <main id="calendar-layout" style={{ marginTop: '75px', marginLeft: '20px', marginRight: '20px' }}>
        <Calendar
          minDurationMinutes={30}
          setter={{ setTitle, setViewType }}
          lunar={lunar}
          calendarRef={ref}
          locale="ko"
        />
      </main>
    </div>
  );
});

export default App;
