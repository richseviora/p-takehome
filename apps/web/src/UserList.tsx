import * as debug from "debug";
import { useQuery } from "@tanstack/react-query";
import { Error, Watch } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { User } from "./UserType.ts";
import { useState } from "react";
import { UserDetail } from "./UserDetail.tsx";

const logger = debug.debug("app:user-list");

const getUsers = async () => {
  logger("loading");
  const response = await fetch("http://localhost:3000/users");
  logger("loaded", { response });
  return response.json();
};

function UserEntry(props: { onClick: () => void; row: User }) {
  return (
    <Card>
      <CardActionArea onClick={props.onClick}>
        <CardMedia sx={{ height: 240 }} image={props.row.thumbnail_url} />
        <CardContent>{props.row.name}</CardContent>
      </CardActionArea>
    </Card>
  );
}

export function UserList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const query = useQuery<Response, unknown, User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  if (query.isError) {
    return <Error />;
  }
  if (query.isPending) {
    return <Watch />;
  }
  const users = query.data;
  return (
    <>
      {selectedUser && (
        <UserDetail
          open={true}
          onClose={() => setSelectedUser(null)}
          user={selectedUser}
        />
      )}
      <Grid container spacing={4}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} key={user.id} md={4}>
            <UserEntry onClick={() => setSelectedUser(user)} row={user} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
