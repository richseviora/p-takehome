import React from 'react';
import './App.css';
import { AppBar, Box, Drawer, styled, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon } from '@mui/icons-material';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function App() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    console.log('I\'m clicked');
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  console.log('rendering');
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open} component="div">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}>
          <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">Meow</Typography>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={handleDrawerClose}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
      </Drawer>
    </Box>
  )
    ;
}

export default App;
