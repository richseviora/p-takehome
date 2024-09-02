import * as debug from "debug";
import type { ReactNode } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { NotifierContext, SseMessages } from "./context.tsx";
import { Fragment, useEffect, useReducer } from "react";
import { extractContextAndGetSpan } from '../tracing/tracing.ts';

const logger = debug.debug("app:listener");

export type ReducerAction =
  | { id: string; message: string; type: "add"; data: SseMessages }
  | { id: string; type: "remove" };

function messageReducer(
  state: Record<string, SseMessages>,
  action: ReducerAction,
): Record<string, SseMessages> {
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
  children: ReactNode;
}

export function Listener(props: IListenerProps) {
  const [messages, dispatch] = useReducer(messageReducer, {});
  const queryClient = useQueryClient();
  useEffect(() => {
    const url = "http://localhost:3000/sse";
    logger("opening SSE connection to", url);
    const sse = new EventSource(url);

    async function getRealtimeData(message: SseMessages) {
      logger("receiving data", message);
      const span = extractContextAndGetSpan(message.__traceparent, 'handle-sse');
      dispatch({
        id: message.data.id,
        message: "Added:" + message.type,
        data: message,
        type: "add",
      });
      if (message.type === "user") {
        logger("invalidating query key", "users");
        await queryClient.invalidateQueries({ queryKey: ["users"] });
      }
      if (message.type === "follow") {
        const id = message.data.user.id;
        logger("invalidating query key", ["users", id]);
        await queryClient.invalidateQueries({ queryKey: ["users", id] });
      }
      span.end();
    }

    sse.onopen = () => {
      logger("SSE connection opened");
    };
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
