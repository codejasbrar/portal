import {createMuiTheme} from "@material-ui/core/styles";

const tableStylesObject = {
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
};

const detailsTableStylesObject = {
  ...tableStylesObject,
  overrides: {
    ...tableStylesObject.overrides,
    MuiTableCell: {
      ...tableStylesObject.overrides.MuiTableCell,
      root: {
        textAlign: 'center !important',
        maxWidth: '25%',
        '&:first-child': {
          width: '35%',
          textAlign: 'left !important'
        },
        '&:nth-child(2)': {
          maxWidth: '10%',
          textAlign: 'right !important'
        },
        '&:nth-child(3)': {
          textAlign: 'right !important',

          // delete if Normal Range column is needed
          display: 'none'
        },
        '&:nth-child(4)': {
          textAlign: 'right !important',

          // delete if Addon column is needed
          display: 'none'
        },
        '&:last-child': {
          textAlign: 'right !important',
          width: '26%'
        },
      }
    }
  }
  //SORRY!!!
  //THNX!_!
};

export const detailsTableTheme = () => (createMuiTheme as any)(detailsTableStylesObject);
export default () => (createMuiTheme as any)(tableStylesObject);
