import { Box, List, ListItem, ListItemText, Modal, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { User } from './UserType.ts';
import { Error, Watch } from '@mui/icons-material';

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
    throw new Error();
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
    return (<Error />);
  }
  if (query.isPending) {
    return (<Watch />);
  }
  const userDetail = query.data;
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Box>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {userDetail.name}
        </Typography>
        <List>
          {userDetail.__follows__.map(follow => (
            <ListItem>
              <ListItemText>{follow.show.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
    </Modal>

  );
}

