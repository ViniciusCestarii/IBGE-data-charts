'use client'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import React, { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: 'rgba(180, 180, 240, 0.7)',
      main: 'rgba(120, 120, 160, 0.7)',
      dark: 'rgba(60, 60, 80, 0.7)',
      contrastText: '#FFF'
    },
    error:{
      light: 'rgba(180, 180, 240, 0.7)',
      main: 'rgba(120, 120, 160, 0.7)',
      dark: 'rgba(60, 60, 80, 0.7)',
      contrastText: '#FFF'
    },
    warning: {
      light: 'rgba(180, 180, 240, 0.7)',
      main: 'rgba(120, 120, 160, 0.7)',
      dark: 'rgba(60, 60, 80, 0.7)',
      contrastText: '#FFF'
    },
    secondary: {
      light: 'rgba(180, 180, 240, 0.7)',
      main: 'rgba(120, 120, 160, 0.7)',
      dark: 'rgba(60, 60, 80, 0.7)',
      contrastText: '#FFF'
    },
},
breakpoints: {
  values: {
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1920
  }
},
components: {
  MuiAutocomplete: {
    styleOverrides: {
      paper: {
        ...({ boxShadow: 'none', border: `1px solid #2B4C81` })
      }
    }
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true
    },
    styleOverrides: {
      root: {
        textTransform: 'none'
      },
      sizeSmall: {
        padding: '6px 16px'
      },
      sizeMedium: {
        padding: '8px 20px'
      },
      sizeLarge: {
        padding: '11px 24px'
      },
      textSizeSmall: {
        padding: '7px 12px'
      },
      textSizeMedium: {
        padding: '9px 16px'
      },
      textSizeLarge: {
        padding: '12px 16px'
      }
    }
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: '16px 24px'
      }
    }
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '32px 24px',
        '&:last-child': {
          paddingBottom: '32px'
        }
      }
    }
  },
  MuiCssBaseline: {
    styleOverrides: {
      '*': {
        boxSizing: 'border-box'
      },
      html: {
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        width: '100%'
      },
      body: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        minHeight: '100%',
        width: '100%'
      },
      '#__next': {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }
    }
  }
},
})

interface MuiThemeprops {
  children: ReactNode
}


const MuiTheme = ({ children }: MuiThemeprops) => {
  return (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  )
}

export default MuiTheme