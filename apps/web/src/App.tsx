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
import { Menu as MenuIcon, Inbox, Error, Watch } from '@mui/icons-material';
import { useQuery, QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { UserList } from './UserList.tsx';



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

const queryClient = new QueryClient();

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

function Page(props: { open: boolean, onClick: () => void, onClose: () => void }) {

  return <Box sx={{ display: 'flex' }}>
    <AppBar position="fixed" open={props.open} component="div">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.onClick}
          edge="start"
          sx={{
            marginRight: 5,
            ...(props.open && { display: 'none' }),
          }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">Meow</Typography>
      </Toolbar>
    </AppBar>
    <FullDrawer open={props.open} onClose={props.onClose} onOpen={props.onClick} />
    <UserList />
  </Box>;
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
      <QueryClientProvider client={queryClient}>
        <Page open={open} onClick={handleDrawerOpen} onClose={handleDrawerClose} />
      </QueryClientProvider>
    </ThemeProvider>
  );

}

export default App;
