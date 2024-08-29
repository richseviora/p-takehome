import { createContext } from "react";

export interface SseType {
  type: string;
  action: string;
  data: {
    id: string;
    name: string;
    created_at: string;
  };
}

export interface IListenerContext {
  messages: Record<string, SseType>;
  onClose: (id: string) => void;
}

export const NotifierContext = createContext<IListenerContext>({
  messages: {},
  onClose: () => {},
});
