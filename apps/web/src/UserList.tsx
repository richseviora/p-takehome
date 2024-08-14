import { useQuery } from '@tanstack/react-query';
import { Error, Watch } from '@mui/icons-material';
import { Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent } from '@mui/material';
import { User } from './UserType.ts';
import { useState } from 'react';
import { UserDetail } from './UserDetail.tsx';

const getUsers = async () => {
  console.log('loading');
  const response = await fetch('http://localhost:3000/users');
  console.log('loaded', { response });
  return response.json();
};

export function UserList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const query = useQuery<Response, unknown, User[]>({ queryKey: ['users'], queryFn: getUsers });
  if (query.isError) {
    return <Error />;
  }
  if (query.isPending) {
    return <Watch />;
  }
  const rows = query.data;
  return (
    <Card sx={{ background: 'linear-gradient(to bottom, #F3F5FB, white)' }}>
      <CardContent>
        <TableContainer>
          {selectedUser && (<UserDetail open={true} onClose={() => setSelectedUser(null)} user={selectedUser} />)}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Last Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Link onClick={() => setSelectedUser(row)}>
                        {row.name}
                      </Link>
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.updated_at}</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent></Card>);
}