"use client";

import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
// import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/bar/nav-bar';
import Header from '../components/header/header';
import MainGrid from '../components/main-grid/main-grid';
import SideMenu from '../components/side-menu/side-menu';
import AppTheme from '../components/theme/app-theme';
import {
  // chartsCustomizations,
  dataGridCustomizations
  // treeViewCustomizations,
} from './custom/data-grid';
import { datePickersCustomizations } from './custom/date-picker';

const xThemeComponents = {
  // ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  // ...treeViewCustomizations,
};

export default function Dashboard() {
  return (
    <AppTheme themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme: Theme) => ({
            flexGrow: 1,
            backgroundColor: `rgba(${theme.palette.background.default} / 1)`,
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header />
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}