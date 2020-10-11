import { createMuiTheme } from '@material-ui/core/styles';

import grey from '@material-ui/core/colors/grey';


const theme = createMuiTheme({
  palette: {
    primary: {
      info: `#eaf3f8`,
      light: '#4a709f',
      main: '#1d4d87',
      dark: '#14355e'
    },
    secondary: {
      light: '#4a9b9f',
      main: '#1d8287',
      dark: '#145b5e'
    },
    background: {
      backPanel: '#e4e5eb',
    }
  },
  overrides: {
   // Style sheet name ⚛️
   MuiDialog:{
     scrollBody: {
       backgroundColor: '#e4e5eb',
     }
   },
   MuiTableContainer:{
     root:{
       borderBottomLeftRadius: 0,
       borderBottomRightRadius: 0,
     },
   },
   MTableToolbar: {
     searchField: {
       maxWidth: 'max-content',
     },
   },
   MuiTableCell: {
     root: {  //This can be referred from Material UI API documentation.
        paddingBottom: '12px',
        paddingTop: '12px',
      },
      head: {
        paddingTop: 9,
        paddingBottom: 9,
        fontSize: '0.75rem',
        color: grey[800],
        backgroundColor: grey[100],
      },
    },
    MuiTabPanel:{
      root: {
        height: '100vh'
      }
    },
    MuiTablePagination: {
      root: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      caption: {
        color: grey[800],
        fontSize: '0.7rem',
      },
    },
    MuiSpeedDial: {
      fab: {

      },
    },
    MuiIconButton: {
      root:{
        padding: 2,
        "&:hover":{
          backgroundColor: 'rgba(228, 229, 235, 0.5)',
        },
      },

    },
    MuiFab: {
      sizeMedium: {
        marginLeft: 10,

      }
    },
    MuiInput:  {
      root: {
        width: '-webkit-fill-available',
      },

    },
    MuiFormControl:{
      root: {
        width: '-webkit-fill-available',

      }
    },
    MuiMenuItem: {
      root: {
        "&:hover":{
          color: '#14355e',
        },
      }
    },

   },
});

export default theme;
