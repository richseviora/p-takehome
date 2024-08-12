import { useQuery } from '@tanstack/react-query';
import { Error, Watch } from '@mui/icons-material';
import { Table, TableBody, TableCell, TableRow, TableHead, TableContainer } from '@mui/material';

interface User {
  name: string;
  id: string;
  updated_at: string;
}

const getUsers = async () => {
  console.log('loading');
  const response = await fetch('http://localhost:3000/users');
  console.log('loaded', { response });
  return response.json();
};

export function UserList() {
  const query = useQuery<Response, unknown, User[]>({ queryKey: ['users'], queryFn: getUsers });
  if (query.isError) {
    return <Error />;
  }
  if (query.isPending) {
    return <Watch />;
  }
  const rows = query.data;
  return (<TableContainer>
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
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.updated_at}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  </TableContainer>);
}