import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { User } from "../UserType.ts";
import { Error as ErrorIcon, Watch } from "@mui/icons-material";
import * as debug from "debug";

const logger = debug.debug("app:user-detail");

interface Follow {
  id: string;
  updated_at: string;
  show: {
    id: string;
    name: string;
    imdb_id: string;
    updated_at: string;
  };
}

interface UserDetail {
  name: string;
  id: string;
  __follows__: Follow[];
  updated_at: string;
}

const getUserDetail = async (id: string) => {
  logger("loading for user ID", id);
  const response = await fetch("http://localhost:3000/users/" + id);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  logger("loaded", { response });
  return response.json();
};

function UserDetailModal(props: {
  name: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  user: User;
}) {
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="lg" fullWidth>
      <DialogTitle id="modal-modal-title" variant="h2" component="h2">
        <Avatar sx={{ height: 80, width: 80 }} src={props.user.thumbnail_url} />
        {props.name}
      </DialogTitle>
      <Box>
        <DialogContent>{props.children}</DialogContent>
      </Box>
    </Dialog>
  );
}

function showUrl(showId: string): string {
  return `https://picsum.photos/seed/${showId}/300/300`;
}

export function UserDetail(props: {
  open: boolean;
  onClose: () => void;
  user: User;
}) {
  const query = useQuery<Response, unknown, UserDetail>({
    queryKey: ["users", props.user.id],
    queryFn: () => getUserDetail(props.user.id),
  });
  if (query.isError) {
    return (
      <UserDetailModal
        open={props.open}
        onClose={props.onClose}
        name="Error"
        user={props.user}
      >
        <ErrorIcon />
      </UserDetailModal>
    );
  }
  if (query.isPending) {
    return (
      <UserDetailModal
        open={props.open}
        onClose={props.onClose}
        name="Loading"
        user={props.user}
      >
        <Watch />
      </UserDetailModal>
    );
  }
  const userDetail = query.data;
  return (
    <UserDetailModal
      open={props.open}
      onClose={props.onClose}
      name={userDetail.name}
      user={props.user}
    >
      <Typography id="modal-modal-title" variant="h4" component="h2">
        Shows Followed
      </Typography>
      <List>
        {userDetail.__follows__.map((follow) => (
          <ListItem key={follow.id}>
            <ListItemAvatar>
              <Avatar src={showUrl(follow.show.id)}></Avatar>
            </ListItemAvatar>
            <ListItemText>{follow.show.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </UserDetailModal>
  );
}
