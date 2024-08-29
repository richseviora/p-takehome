import * as debug from "debug";
import { NotifierContext, SseType } from "./context.tsx";
import { Fragment, useEffect, useReducer } from "react";

const logger = debug.debug('app:listener');

export type ReducerAction =
  | { id: string; message: string; type: "add"; data: SseType }
  | { id: string; type: "remove" };

function messageReducer(
  state: Record<string, SseType>,
  action: ReducerAction,
): Record<string, SseType> {
  logger("handling reducer action", action);
  switch (action.type) {
    case "add":
      return { ...state, [action.id]: action.data };
    case "remove":
      // eslint-disable-next-line no-case-declarations
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
}

export interface IListenerProps {
  children: React.ReactNode;
}

export function Listener(props: IListenerProps) {
  const [messages, dispatch] = useReducer(messageReducer, {});
  useEffect(() => {
    const sse = new EventSource("http://localhost:3000/sse");

    function getRealtimeData(data: SseType) {
      logger("receiving data", data);
      dispatch({
        id: data.data.id,
        message: "Added:" + data.data.name,
        data,
        type: "add",
      });
    }

    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = (e) => {
      logger("Encountered Error, terminating SSE", e);
      sse.close();
    };
    return () => {
      sse.close();
    };
  });

  const onClose = (id: string) => {
    dispatch({ id: id, type: "remove" });
  };

  return (
    <Fragment>
      <NotifierContext.Provider
        value={{
          messages,
          onClose: onClose,
        }}
      >
        {props.children}
      </NotifierContext.Provider>
    </Fragment>
  );
}
