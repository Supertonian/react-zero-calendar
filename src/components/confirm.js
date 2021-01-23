import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ColorPalette } from 'material-ui-color';

export default function AlertDialog({
  open,
  handleClose,
  handleOkClick,
  title,
  content,
  okText,
  cancelText,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOkClick} color="primary" autoFocus>
          {okText}
        </Button>
        {cancelText && (
          <Button onClick={handleClose} color="secondary">
            {cancelText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export function ColorPicker({
  open,
  initialColor,
  handleClose,
  handleOkClick,
  title,
  okText,
  cancelText,
  palette,
}) {
  const [color, setColor] = useState();
  useEffect(() => {
    if (open) setColor(initialColor);
  }, [initialColor, open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <ColorPalette palette={palette} value={color} onSelect={setColor} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleOkClick(color)} color="primary" autoFocus>
          {okText}
        </Button>
        {cancelText && (
          <Button onClick={handleClose} color="secondary">
            {cancelText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
