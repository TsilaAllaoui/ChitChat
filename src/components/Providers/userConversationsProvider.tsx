import { Children, useState } from "react";
import { IConversation } from "../MainPage";
import { UserConversationsContext } from "../../Contexts/UserConversationsContext";

const userConversationsProvider = ({ children }: { children: JSX.Element }) => {
  const [userConversations, setUserConversations] = useState<IConversation[]>(
    []
  );

  const [currentConversation, setCurrentConversation] =
    useState<IConversation | null>(null);
  return (
    <UserConversationsContext.Provider
      value={{
        userConversations,
        setUserConversations,
        currentConversation,
        setCurrentConversation,
      }}
    >
      {children}
    </UserConversationsContext.Provider>
  );
};

export default userConversationsProvider;
