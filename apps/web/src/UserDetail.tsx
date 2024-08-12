import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { User } from './UserType.ts';
import { Error as ErrorIcon, Watch } from '@mui/icons-material';

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
  console.log('loading');
  const response = await fetch('http://localhost:3000/users/' + id);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  console.log('loaded', { response });
  return response.json();
};


export function UserDetail(props: { open: boolean, onClose: () => void, user: User }) {

  const query = useQuery<Response, unknown, UserDetail>({
    queryKey: ['users', props.user.id],
    queryFn: () => getUserDetail(props.user.id),
  });
  if (query.isError) {
    return (<ErrorIcon />);
  }
  if (query.isPending) {
    return (<Watch />);
  }
  const userDetail = query.data;
  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="lg">
      <Box>
        <DialogTitle id="modal-modal-title" variant="h2" component="h2">
          {userDetail.name}
        </DialogTitle>
        <DialogContent>
          <Typography id="modal-modal-title" variant="h4" component="h2">
            Shows Followed
          </Typography>
          <List>
            {userDetail.__follows__.map(follow => (
              <ListItem>
                <ListItemText>{follow.show.name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Box>
    </Dialog>

  );
}

