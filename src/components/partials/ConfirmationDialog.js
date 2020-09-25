import React, {Fragment} from 'react'

import { makeStyles } from '@material-ui/core/styles';

import {Dialog,  DialogContent, DialogActions, Button, List} from '@material-ui/core';
import DialogTitle from './DialogTitle'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function ConfirmationDialog({open, data, showTitle, showRow, onClose, onConfirm, ...other}){
  const classes = useStyles();

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onConfirm(data);
    onClose();
  };
  return (
    <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="md"
        aria-labelledby="confirmation-dialog-title"
        open={open}
        {...other}
      >
        <DialogTitle onClose={onClose} id="confirmation-dialog-title">{showTitle(data)}</DialogTitle>
        <DialogContent dividers>
          <List>
          {data.map((row, idx) => showRow(row, idx))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleOk} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
  )
}
