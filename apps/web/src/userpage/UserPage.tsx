import { Box, Typography } from '@mui/material';
import { UserList } from './UserList.tsx';

export function UserPage() {
  return (
    <Box component="div">
      <Typography variant="h3">Users</Typography>
      <UserList />
    </Box>
  );
}