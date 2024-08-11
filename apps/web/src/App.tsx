import React from 'react';
import './App.css';
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon, ListItemText,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, Inbox } from '@mui/icons-material';

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
      <IconButton onClick={open ? props.onClose : props.onOpen}>
        <ChevronLeftIcon />
      </IconButton>
    </DrawerHeader>
    <List>
      {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text) => (
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
              }}
            >
              <Inbox />
            </ListItemIcon>
            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
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
  )
    ;
}

export default App;
