import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Calendar from './components/calendar';

const LeftSidebarWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  title: {
    marginRight: '70px',
  },
  yearMonth: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${LeftSidebarWidth}px)`,
    marginLeft: LeftSidebarWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: LeftSidebarWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: LeftSidebarWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -LeftSidebarWidth,
    marginTop: 64,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const ref = React.createRef();
  const [open, setOpen] = useState(false);
  const [transitionEnded, setTransitionEnded] = useState(false);
  const [title, setTitle] = useState('');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
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

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            캘린더
          </Typography>
          <IconButton onClick={handleTodayClick} color="inherit" aria-label="today-button" edge="start">
            <Button variant="outlined" color="default">
              오늘
            </Button>
          </IconButton>
          <IconButton onClick={handlePrevClick} color="inherit" aria-label="arrow-left" edge="start">
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={handleNextClick} color="inherit" aria-label="arrow-right" edge="start">
            <NavigateNextIcon />
          </IconButton>
          <Typography variant="h6" className={classes.yearMonth}>
            {title}
          </Typography>
          <IconButton color="inherit" aria-label="user-setting" edge="start">
            <SettingsIcon />
          </IconButton>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={0}
            // onChange={}
          >
            <MenuItem value={0}>월</MenuItem>
            <MenuItem value={1}>주</MenuItem>
            <MenuItem value={2}>일</MenuItem>
          </Select>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <Button>만들기</Button>
        <List>
          {['내 캘린더'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['다른 캘린더'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        onTransitionEnd={() => setTransitionEnded(!transitionEnded)}
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Calendar setTitle={setTitle} calendarRef={ref} sidebarOpened={transitionEnded} />
      </main>
    </div>
  );
}

export default App;
