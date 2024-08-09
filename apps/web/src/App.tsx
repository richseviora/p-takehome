import React from 'react';
import './App.css';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function App() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    console.log("I'm clicked");
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  console.log("rendering");
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
            }}></IconButton>
          <MenuIcon />
          <Typography variant="h6" noWrap component="div">Meow</Typography>
        </Toolbar>

      </AppBar>
    </Box>
  );
}

export default App;
