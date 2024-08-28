import { useEffect, useReducer, Fragment } from "react";
import { Snackbar } from "@mui/material";

type ReducerAction =
  | { id: string; message: string; type: "add" }
  | { id: string; type: "remove" };

interface SseType {
  type: string;
  action: string;
  data: {
    id: string;
    name: string;
    created_at: string;
  };
}

function messageReducer(
  state: Record<string, string>,
  action: ReducerAction,
): Record<string, string> {
  switch (action.type) {
    case "add":
      return { ...state, [action.id]: action.message };
    case "remove":
      // eslint-disable-next-line no-case-declarations
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
}

export interface INotifierProps {
  onAddedItem: (id: string, type: string) => void;
  onUpdatedItem: (id: string, type: string) => void;
}

export function Notifier(props: INotifierProps) {
  const [messages, dispatch] = useReducer(messageReducer, {});
  useEffect(() => {
    const sse = new EventSource("http://localhost:3000/sse");

    function getRealtimeData(data: SseType) {
      console.log(data);
      if (data.action === "add") {
        props.onAddedItem(data.data.id, data.type);
      }
      dispatch({
        id: data.data.id,
        message: "Added:" + data.data.name,
        type: "add",
      });
    }

    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = (e) => {
      console.error("Encountered Error, terminating SSE", e);
      sse.close();
    };
    return () => {
      sse.close();
    };
  });

  return (
    <Fragment>
      {Object.keys(messages).map((key) => (
        <Notification
          key={key}
          message={messages[key]}
          onClose={() => dispatch({ id: key, type: "remove" })}
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
