import { Fragment, useContext } from "react";
import { Snackbar } from "@mui/material";
import { Person, Tv, Watch } from "@mui/icons-material";
import { NotifierContext, SseMessages } from "./context.tsx";

export function NotifierDisplay() {
  const { messages, onClose } = useContext(NotifierContext);
  return (
    <Fragment>
      {Object.keys(messages).map((key) => (
        <Notification
          key={key}
          message={messages[key]}
          onClose={() => {
            onClose(key);
          }}
        />
      ))}
    </Fragment>
  );
}

const typeToColorMap: Record<string, string> = {
  add: "green",
  updated: "blue",
  remove: "red",
};

const typeToIconMap = {
  user: <Person />,
  follow: <Watch />,
  show: <Tv />,
};

export function Notification(props: {
  message: SseMessages;
  onClose: () => void;
}) {
  const type = props.message.type;
  const action = props.message.action;
  const backgroundColor = typeToColorMap[action];
  const icon = typeToIconMap[type];

  return (
    <Snackbar
      onClose={props.onClose}
      open={true}
      ContentProps={{ sx: { backgroundColor: backgroundColor } }}
      message={
        <>
          {icon}
          {type} has been {action}
        </>
      }
    />
  );
}
