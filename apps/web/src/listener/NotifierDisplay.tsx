import { Fragment, useContext } from "react";
import { Snackbar } from "@mui/material";
import { NotifierContext } from "./context.tsx";

export function NotifierDisplay() {
  const { messages, onClose } = useContext(NotifierContext);
  return (
    <Fragment>
      {Object.keys(messages).map((key) => (
        <Notification
          key={key}
          message={messages[key].data.name}
          onClose={() => {
            onClose(key);
          }}
        />
      ))}
    </Fragment>
  );
}

export function Notification(props: { message: string; onClose: () => void }) {
  return (
    <Snackbar message={props.message} onClose={props.onClose} open={true} />
  );
}
