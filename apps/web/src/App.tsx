import React from "react";
import {
  AppBar,
  Button,
  Container,
  createTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Person as PersonIcon,
  Tv as TvIcon,
  ChevronRight,
  ChevronLeft,
} from "@mui/icons-material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Listener } from "./listener/Listener.tsx";
import { NotifierDisplay } from "./listener/NotifierDisplay.tsx";
import { ShowDialog } from "./ShowDialog.tsx";
import { UserPage } from "./userpage/UserPage.tsx";

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
      main: "#4B03C2",
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#4B03C2",
          color: "white",
        },
      },
    },
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const queryClient = new QueryClient();

function FullDrawer(props: {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  onShowClick: () => void;
}) {
  const { open, onClose, onOpen, onShowClick } = props;
  return (
    <Drawer open={open} onClose={onClose} variant="permanent">
      <DrawerHeader>
        {open ? (
          <ChevronLeft onClick={onClose} />
        ) : (
          <ChevronRight onClick={onOpen} />
        )}
      </DrawerHeader>
      <List>
        {["Users", "Shows"].map((text) => (
          <ListItem
            key={text}
            disablePadding
            sx={{ display: "block" }}
            onClick={onShowClick}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {text === "Users" ? <PersonIcon /> : <TvIcon />}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ display: open ? "inherit" : "none" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

function FullAppBar() {
  return (
    <AppBar position="fixed" component="div" sx={{ backgroundColor: "white" }}>
      <Toolbar sx={{ paddingLeft: "100px !important" }}>
        <Button color="primary">Add User</Button>
        <Button color="warning">Reticulate Splines</Button>
        <Button color="info">Lecture Errant Subsystems</Button>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Users
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function Page(props: {
  open: boolean;
  onClick: () => void;
  onClose: () => void;
}) {
  const [showOpenDialog, setShowOpenDialog] = React.useState(false);
  const onShowClick = () => setShowOpenDialog(true);
  const onShowDismiss = () => setShowOpenDialog(false);
  return (
    <Container sx={{ paddingLeft: "100px !important" }}>
      {showOpenDialog && <ShowDialog onClose={onShowDismiss} />}
      <NotifierDisplay />
      <FullAppBar />
      <FullDrawer
        open={props.open}
        onClose={props.onClose}
        onOpen={props.onClick}
        onShowClick={onShowClick}
      />
      <UserPage />
    </Container>
  );
}

function App() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <ThemeProvider theme={customTheme}>
      <QueryClientProvider client={queryClient}>
        <Listener>
          <Page
            open={open}
            onClick={handleDrawerOpen}
            onClose={handleDrawerClose}
          />
        </Listener>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
