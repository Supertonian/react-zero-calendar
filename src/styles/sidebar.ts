import { makeStyles } from '@material-ui/core/styles';

export const sidebarStyles = makeStyles(theme => ({
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
