import { createContext } from "react";
import { IConversation } from "../components/MainPage";

export interface IUserConversations {
  userConversations: IConversation[];
  setUserConversations: (_c: IConversation[]) => void;
  currentConversation: IConversation | null;
  setCurrentConversation: (_c: IConversation | null) => void;
  userConversationsLoading: boolean;
  currentConversationLoading: boolean;
}

export const UserConversationsContext = createContext<IUserConversations>({
  userConversations: [],
  setUserConversations: (_u: IConversation[]) => {},
  currentConversation: null,
  setCurrentConversation: (_c: IConversation | null) => {},
  userConversationsLoading: true,
  currentConversationLoading: true,
});
