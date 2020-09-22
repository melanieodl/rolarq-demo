import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    img: {
      maxWidth: '100%',
      paddingRight: theme.spacing(2)
    }
  }));

const HelpImg = ({image}) => {
  const classes = useStyles()
  return (
    <img src={image} alt='instrucciones' className={classes.img}/>
  )
}

export default HelpImg
