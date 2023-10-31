import { createContext } from "react";

export type Reply = {
  originContent: string;
  setOriginContent: (_s: string) => void;
  content: string;
  setContent: (_s: string) => void;
  scrollToOrigin: boolean;
  setScrollToOrigin: (_b: boolean) => void;
};

export const ReplyEntryContext = createContext<Reply>({
  content: "",
  setContent: (_s: string) => {},
  originContent: "",
  setOriginContent: (_s: string) => {},
  scrollToOrigin: false,
  setScrollToOrigin: (_b: boolean) => {},
});
