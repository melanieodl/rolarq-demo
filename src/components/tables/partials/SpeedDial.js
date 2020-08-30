import React, {Fragment} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Typography} from '@material-ui/core'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddBoxIcon from '@material-ui/icons/AddBox';


const useStyles = makeStyles((theme) => ({
  // root: {
  //   transform: 'translateZ(0px)',
  //   flexGrow: 1,
  // },
  // exampleWrapper: {
  //   position: 'relative',
  //   marginTop: theme.spacing(3),
  //   height: 380,
  // },
  // radioGroup: {
  //   margin: theme.spacing(1, 0),
  // },
  speedDial: {
    marginRight: theme.spacing(1),
  //   position: 'absolute',
  //   '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
  //     bottom: theme.spacing(2),
  //     right: theme.spacing(2),
  //   },
  //   '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
  //     top: theme.spacing(2),
  //     left: theme.spacing(2),
  //   },
  },
}));



export default function SpeedDials(props) {
  const classes = useStyles();
  const [direction, setDirection] = React.useState('up');
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleDirectionChange = (event) => {
    setDirection(event.target.value);
  };

  const handleHiddenChange = (event) => {
    setHidden(event.target.checked);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };


  return (

        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          hidden={hidden}
          icon={<SpeedDialIcon icon=<AddBoxIcon/>/>}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction={'left'}
          FabProps= {{size: 'small', variant: 'extended', children: 'Costo',
                      disableFocusRipple: true, disableRipple: true }}
        >

          {props.actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {handleClose(); action.onClick()}}
            />
          ))}
        </SpeedDial>
  );
}
