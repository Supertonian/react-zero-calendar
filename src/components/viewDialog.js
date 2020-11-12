import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

const ViewDialogComponent = ({ open, setOpen, event }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-create-dialog">
      <DialogTitle id="responsive-dialog-title" style={{ textAlign: 'right' }}>
        <IconButton aria-label="edit-button">
          <EditOutlinedIcon />
        </IconButton>
        <IconButton aria-label="delete-button">
          <DeleteOutlineIcon color="error" />
        </IconButton>
        <IconButton aria-label="mail-button">
          <MailOutlineIcon color="primary" />
        </IconButton>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers style={{ width: '500px' }}>
        <Container>{event.title}</Container>
        <Container>{`${event.startStr} - ${event.endStr}`}</Container>
        <Container>{event.importance}</Container>
        <Container>{event.allDay}</Container>
        <Container>{event.extendedProps?.place}</Container>
      </DialogContent>
    </Dialog>
  );
};

export const ViewDialog = ViewDialogComponent;
