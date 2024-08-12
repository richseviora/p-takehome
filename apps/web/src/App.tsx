import React from 'react';
import './App.css';
import {
  AppBar,
  Box, createTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon, ListItemText,
  styled, ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Menu as MenuIcon, Inbox } from '@mui/icons-material';

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#4B03C2',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#4B03C2',
          color: 'white',
        },
      },
    },
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


function FullDrawer(props: { open: boolean, onClose: () => void, onOpen: () => void }) {
  const { open, onClose } = props;
  return <Drawer open={props.open} onClose={props.onClose} variant="permanent">
    <DrawerHeader>
    </DrawerHeader>
    <List>
      {['Inbox', 'Starred', 'Send Email', 'Drafts'].map((text) => (
        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Inbox />
            </ListItemIcon>
            <ListItemText primary={text} sx={{ display: open ? 'inherit' : 'none' }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Drawer>;
}

function App() {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    console.log('I\'m clicked');
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <ThemeProvider theme={customTheme}>
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
        <FullDrawer open={open} onClose={handleDrawerClose} onOpen={handleDrawerOpen} />
      </Box>
    </ThemeProvider>
  );

}

export default App;
