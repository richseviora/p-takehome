import * as debug from "debug";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  Error,
  Watch,
  Female,
  Male,
  Transgender,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { User } from "../UserType.ts";
import { useContext, useState } from "react";
import { UserDetail } from "./UserDetail.tsx";
import { NotifierContext, SseMessages } from "../listener/context.tsx";

const logger = debug.debug("app:user-list");

const getUsers = async () => {
  logger("loading");
  const response = await fetch("http://localhost:3000/users");
  logger("loaded", { response });
  return response.json();
};

function UserEntry(props: {
  onClick: () => void;
  user: User;
  hasUpdate: boolean;
}) {
  const { gender } = props.user;
  const icon =
    gender.toLowerCase() === "male" ? (
      <Male />
    ) : gender.toLowerCase() === "female" ? (
      <Female />
    ) : (
      <Transgender />
    );

  return (
    <Card>
      <CardActionArea onClick={props.onClick}>
        <CardMedia sx={{ height: 240 }} image={props.user.thumbnail_url} />
        <CardContent>
          {props.hasUpdate && <Star />}
          {icon} {props.user.name}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

const getUserUpdates = (
  messages: Record<string, SseMessages>,
): Record<string, number> => {
  const userUpdates: Record<string, number> = {};
  Object.entries(messages).forEach(([, value]) => {
    if (value.type === "follow") {
      userUpdates[value.data.user.id] = 1;
    }
  });
  return userUpdates;
};

export function UserList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { messages } = useContext(NotifierContext);
  const usersWithNewFollows = getUserUpdates(messages);
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
            <UserEntry
              onClick={() => setSelectedUser(user)}
              user={user}
              hasUpdate={usersWithNewFollows[user.id] != null}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
