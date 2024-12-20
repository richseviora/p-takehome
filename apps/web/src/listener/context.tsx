import { createContext } from "react";

interface TypeMap {
  user: User;
  show: Show;
  follow: Follow;
}

export interface SseMessage<T extends keyof TypeMap> {
  type: T;
  action: string;
  data: TypeMap[T];
  __traceparent?: string;
}

type CreateUnion<T extends keyof TypeMap> = T extends keyof TypeMap
  ? SseMessage<T>
  : never;

export type SseMessages = CreateUnion<keyof TypeMap>;

export interface Show {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  imdb_id: string;
}

export interface User {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  gender: string;
  thumbnail_url: string;
}

export interface Follow {
  id: string;
  user: User;
  show: Show;
}

export interface IListenerContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Record<string, SseMessages>;
  onClose: (id: string) => void;
}

export const NotifierContext = createContext<IListenerContext>({
  messages: {},
  onClose: () => {},
});
