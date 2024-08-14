import React from 'react';
import {
  AppBar,
  Box, Container, createTheme,
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserList } from './UserList.tsx';
import { Notifier } from './Notifier.tsx';


// Colour Notes
/**
 * Sidebar ends at 4C09C3, starts at 4C02C2
 * Main background top at F3F3F3 ends at F1F3F6
 * Focus element starts at F6F6FC
 * Top Bar is F6F6FC
 *
 */


const customTheme = createTheme({
  palette: {
    primary: {
      main: '#4B03C2',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides:
        {
          colorDefault: '#F6F6C6',
        },
    },
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
  return <Drawer open={open} onClose={onClose} variant="permanent">
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

function UserPage() {
  return <Box component="div">
    <Typography variant="h3">Users</Typography>
    <UserList /></Box>;
}

function Page(props: { open: boolean, onClick: () => void, onClose: () => void }) {

  return <Container>
    <AppBar position="fixed" component="div" color="default">
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
    <UserPage />
    <Notifier />
  </Container>;
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
