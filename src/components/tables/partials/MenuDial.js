import React, {useState} from 'react';
import api from '../../../api'
import {Fab} from '@material-ui/core'
import {ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList} from '@material-ui/core';
import { Button, LinearProgress } from '@material-ui/core';

import Icon from '@material-ui/icons/MoreVert';
import CementDialogForm from '../../materials_forms/Cement'



import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    zIndex: 100
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  item: {
    '&:hover':{
      color: theme.palette.primary,
    },
  },
}));





export default function MenuListComposition(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [formDialog, setFormDialog] = React.useState({active: CementDialogForm})


  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleHover =() => {
    setOpen(true)
  }
  const handleLeave =() => {
    setOpen(false)
  }

  const handleCloseMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleOpenModal = (e, form) => {
    setFormDialog({active: form})
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }


  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);



  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div onMouseLeave={handleLeave}>
        <Fab
          color='primary'
          size="medium"
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onMouseOver={handleHover}
          onClick={handleToggle}
        >
              <Icon />
        </Fab>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper elevation={10}>
                <ClickAwayListener onClickAway={handleCloseMenu}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {props.actions.map(item => (<MenuItem onClick={(e) => {handleOpenModal(e, item.form)}}>{item.name}</MenuItem>)
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
      <formDialog.active closeModal={() => setOpenModal(false)} openModal={openModal} setData={props.setData} budgetId={props.budgetId}/>

    </div>
  );
}
