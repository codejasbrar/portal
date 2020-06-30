import {createMuiTheme} from "@material-ui/core/styles";

export default () => (createMuiTheme as any)({
  palette: {
    primary: {
      main: '#00aaff',
    }
  },
  overrides: {
    MUIDataTable: {
      root: {
        backgroundColor: "#ffffff",
      },
      paper: {
        boxShadow: "none",
        position: "relative"
      }
    },
    MUIDataTableBodyCell: {
      root: {
        color: '#232d37',
        fontFamily: "Open Sans",
        fontSize: '14px',
        fontWeight: '400',
        letterSpacing: '0.3px',
      },
    },
    MuiToolbar: {
      root: {
        backgroundColor: '#ffffff',
        padding: '0px!important',
        marginBottom: '15px',
      }
    },
    MuiTableCell: {
      head: {
        color: '#232d37',
        fontFamily: "Open Sans",
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.3px',
        borderBottom: '1px solid #c3c8cd!important'
      },
      root: {
        borderBottom: '1px solid #e1e4e6!important',

        '&:only-child': {
          borderBottom: '0!important',
        }
      }
    },
    MuiTableRow: {
      hover: {
        "&:hover": {
          backgroundColor: "#f5f5f5 !important"
        },
        '&:only-child': {
          "&:hover": {
            backgroundColor: "#fff !important"
          },
        }
      },
      root: {
        '&$selected': {
          backgroundColor: '#f5f5f5 !important'
        }
      }
    },
    MuiCheckbox: {
      root: {
        color: '#c3c8cd',
      },

      '& .Mui-checked': {
        color: '#00aaff',
      }
    },
    MuiTableFooter: {
      root: {
        '& .MuiToolbar-root': {
          color: '#232d37',
          fontFamily: "Open Sans",
          fontSize: '14px',
        }
      }
    },
    MuiTypography: {
      root: {
        fontFamily: "Open Sans!important",
        color: '#232d37',
        textAlign: 'left!important',
      }
    },
    MUIDataTableToolbarSelect: {
      root: {
        boxShadow: 'none !important',
        backgroundColor: 'transparent !important',
        position: 'absolute !important',
        right: 0,
        width: '150px',
        top: 0,
        paddingTop: '14px !important',

        "& div h6": {
          display: 'none'
        }
      }
    }
  }
});