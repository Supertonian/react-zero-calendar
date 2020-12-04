﻿import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Container, DialogActions } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { makeStyles } from '@material-ui/core/styles';
import { EditDialog } from './editDialog';
const ViewDialogComponent = ({ setOpen, event, deleteEvent, editEvent }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  function handleClose() {
    setOpen(false);
  }
  const useStyles = makeStyles(theme => ({
    marginIcon: {
      marginLeft: 200,
    },
  }));

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
  const classes = useStyles();
  return (
    <>
      <Dialog fullScreen={fullScreen} open={true} onClose={handleClose} aria-labelledby="responsive-view-dialog">
        <DialogTitle id="responsive-dialog-title" style={{ textAlign: 'left' }}>
          {' '}
          일정
          <IconButton
            className={classes.marginIcon}
            aria-label="edit-button"
            onClick={() => {
              setEditDialogOpen(true);
              //handleClose();
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
        <DialogContent style={{ height: '200px' }} dividers>
          <Container>{event.title}</Container>
          <Container>{`${event.startStr} - ${event.endStr}`}</Container>
          <Container>{event.importance}</Container>
          <Container>{event.allDay}</Container>
          <Container>{event.extendedProps?.place}</Container>
        </DialogContent>
      </Dialog>

      {editDialogOpen && <EditDialog setOpen={setEditDialogOpen} editEvent={editEvent} editInfo={editInfo} />}
    </>
  );
};

export const ViewDialog = ViewDialogComponent;
