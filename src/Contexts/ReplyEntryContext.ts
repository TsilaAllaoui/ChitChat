import { createContext } from "react";

export type Reply = {
  originContent: string;
  setOriginContent: (_s: string) => void;
  content: string;
  setContent: (_s: string) => void;
  scrollToOrigin: boolean;
  setScrollToOrigin: (_b: boolean) => void;
  sendReply: boolean;
  setSendReply: (_b: boolean) => void;
  repliedMessage: string;
  setRepliedMessage: (_s: string) => void;
};

export const ReplyEntryContext = createContext<Reply>({
  content: "",
  setContent: (_s: string) => {},
  originContent: "",
  setOriginContent: (_s: string) => {},
  scrollToOrigin: false,
  setScrollToOrigin: (_b: boolean) => {},
  sendReply: false,
  setSendReply: (_b: boolean) => {},
  repliedMessage: "",
  setRepliedMessage: (_s: string) => {},
});
