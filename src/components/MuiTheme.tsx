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
    secondary: {
      light: 'rgba(180, 180, 240, 0.7)',
      main: 'rgba(120, 120, 160, 0.7)',
      dark: 'rgba(60, 60, 80, 0.7)',
      contrastText: '#FFF'
    },
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