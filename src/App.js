import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
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
import Calendar from './components/calendar';
import { Hidden } from '@material-ui/core';
import useStores from './stores/useStores';

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

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({ left: false });
  const ref = React.createRef(); // calendar ref
  const [title, setTitle] = React.useState('');
  const [viewType, setViewType] = React.useState('dayGridMonth');
  const didMountRef = React.useRef(false); // to check mounted
  const { calendarStore } = useStores();

  React.useEffect(() => {
    if (didMountRef.current) {
      ref.current.getApi().changeView(viewType);
    } else didMountRef.current = true;
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

  const Sider = anchor => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Hidden smUp>
        <List>
          {[
            ['월', 'dayGridMonth'],
            ['주', 'timeGridWeek'],
            ['일', 'timeGridDay'],
          ].map((item, index) => (
            <ListItem button key={index} onClick={() => setViewType(item[1])}>
              {item[0]}
            </ListItem>
          ))}
        </List>
        <Divider />
      </Hidden>
      <List>
        {['음력', '공휴일'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
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
          <IconButton onClick={toggleDrawer('left', true)} color="inherit" aria-label="open drawer" edge="start">
            <MenuIcon />
          </IconButton>
          <Hidden xsDown>
            <Typography variant="h6" className={classes.title}>
              캘린더
            </Typography>
            <IconButton onClick={handleTodayClick} color="inherit" aria-label="today-button" edge="start">
              <Button size="small" variant="contained" color="primary">
                오늘
              </Button>
            </IconButton>
            <IconButton onClick={handlePrevClick} color="inherit" aria-label="arrow-left" edge="start">
              <NavigateBeforeIcon />
            </IconButton>
            <IconButton onClick={handleNextClick} color="inherit" aria-label="arrow-right" edge="start">
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
      <main style={{ marginTop: '75px', marginLeft: '20px', marginRight: '20px' }}>
        <Calendar setTitle={setTitle} calendarRef={ref} locale="ko" />
      </main>
    </div>
  );
}
