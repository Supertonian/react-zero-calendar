import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import {
  Container,
  DialogContentText,
  Grid,
  Input,
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import { ColorPalette } from 'material-ui-color';
import { DateTime } from 'luxon';

const ViewDialogComponent = ({ setOpen, event, deleteEvent, editEvent }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [title, setTitle] = React.useState();
  const [selectedStartDate, setSelectedStartDate] = React.useState();
  const [selectedEndDate, setSelectedEndDate] = React.useState();
  const [allDay, setAllDay] = React.useState(false);
  const [importance, setImportance] = React.useState();
  const [place, setPlace] = React.useState();
  const [color, setColor] = React.useState('black');
  const [editFlag, setEditFlag] = React.useState(false);

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

  function handleSave() {
    const isAllDay = (selectedEndDate - selectedStartDate) / (60 * 60 * 1000) >= 24;

    const editInfo = {
      type: 'list',
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      display: event.display,
      place: event.extendedProps.place,
      forceAllDay: event.forceAllDay,
      color: event.color,
    };

    const eventInfo = {
      start: selectedStartDate.toISO(),
      end: selectedEndDate.toISO(),
      importance,
      title: title.trim() === '' ? '(제목없음)' : title,
      allDay: allDay || isAllDay,
      place,
      forceAllDay: allDay,
      color,
    };
    editEvent(editInfo.id, eventInfo);
    setOpen(false);
  }

  function handleClose() {
    setOpen(false);
  }
  const handleTitle = event => {
    setTitle(event.target.value);
  };

  const handleAllDayChange = event => {
    setAllDay(event.target.checked);
  };

  const handleimportanceChange = event => {
    setImportance(event.target.checked);
  };
  const handlePlaceChange = event => {
    setPlace(event.target.value);
  };
  const handleStartDateChange = date => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = date => {
    setSelectedEndDate(date);
  };

  const useStyles = makeStyles(theme => ({
    marginIcon: {
      marginLeft: 200,
    },
  }));
  const classes = useStyles();

  function nvl(str, defaultStr) {
    if (typeof str === 'undefined' || str === null || str === '') str = '';
    return str;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={true}
        onClose={handleClose}
        aria-labelledby="responsive-view-dialog"
      >
        <DialogTitle id="responsive-dialog-title" style={{ textAlign: 'left' }}>
          {' '}
          일정
          <IconButton
            className={classes.marginIcon}
            aria-label="edit-button"
            onClick={() => {
              setEditFlag(true);
              setTitle(nvl(event.title));
              setPlace(nvl(event.extendedProps?.place));
              setSelectedStartDate(DateTime.fromISO(event.startStr));
              setSelectedEndDate(DateTime.fromISO(event.endStr));
              setAllDay(event.allDay);
              setImportance(event.extendedProps.importance);
            }}
          >
            <EditOutlinedIcon />
          </IconButton>
          <IconButton
            aria-label="delete-button"
            onClick={() => {
              deleteEvent(event.id);
              handleClose();
            }}
          >
            <DeleteOutlineIcon color="error" />
          </IconButton>
          <IconButton aria-label="mail-button">
            <MailOutlineIcon color="primary" />
          </IconButton>
          <IconButton aria-label="close" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {editFlag && (
          <>
            <DialogContent>
              <DialogContentText>
                <Container>
                  <Grid container>
                    <Input
                      autoFocus
                      placeholder="제목을 입력해주세요"
                      value={title}
                      onChangeCapture={handleTitle}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={allDay} onChange={handleAllDayChange} name="allDay" />
                      }
                      label="종일"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={importance}
                          onChange={handleimportanceChange}
                          name="importance"
                        />
                      }
                      label="중요"
                    />
                  </Grid>
                </Container>
                <Container>
                  <MuiPickersUtilsProvider utils={LuxonUtils}>
                    <Grid container justify="space-around">
                      <DateTimePicker
                        margin="normal"
                        id="edit-datetime-picker"
                        label="시작 날짜 시간"
                        format="yyyy-MM-dd HH:mm:ss"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
                      />
                      <DateTimePicker
                        margin="normal"
                        id="end-datetime-picker"
                        label="끝 날짜 시간"
                        format="yyyy-MM-dd HH:mm:ss"
                        value={selectedEndDate}
                        onChange={handleEndDateChange}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </Container>
                <Container>
                  <Input
                    placeholder="장소를 입력해주세요"
                    value={place}
                    onChange={handlePlaceChange}
                  />
                </Container>
                <Container>
                  <ColorPalette palette={palette} value={color} onSelect={setColor} />
                </Container>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                취소
              </Button>
              <Button onClick={handleSave} color="primary">
                저장
              </Button>
            </DialogActions>
          </>
        )}
        {editFlag === false && (
          <DialogContent style={{ height: '200px' }} dividers>
            <Container>{event.title}</Container>
            <Container>{`${event.startStr} - ${event.endStr}`}</Container>
            <Container>{event.importance}</Container>
            <Container>{event.allDay}</Container>
            <Container>{event.extendedProps?.place}</Container>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export const ViewDialog = ViewDialogComponent;
