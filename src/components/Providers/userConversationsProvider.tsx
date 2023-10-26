import { Children, useContext, useEffect, useState } from "react";
import { IConversation } from "../MainPage";
import { UserConversationsContext } from "../../Contexts/UserConversationsContext";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query } from "firebase/firestore";
import { db } from "../../Firebase";
import { UserContext } from "../../Contexts/UserContext";

const userConversationsProvider = ({ children }: { children: JSX.Element }) => {
  const [userConversations, setUserConversations] = useState<IConversation[]>(
    []
  );
  const [userConversationsLoading, setUserConversationsLoading] =
    useState(true);

  const [currentConversationLoading, setCurrentConversationLoading] =
    useState(true);

  // ************  Firestore hooks   ************

  const [value, loading, error] = useCollection(
    query(collection(db, "conversations"))
  );

  const user = useContext(UserContext).user;

  useEffect(() => {
    if (!loading) {
      console.log(loading);
      setUserConversationsLoading(loading);
    }
  }, [loading]);

  useEffect(() => {
    const tmp: IConversation[] = [];
    value?.docs.map((doc) => {
      const data = doc.data();
      if (data.guestId == user!.uid || data.hostId == user!.uid) {
        tmp.push({
          guestId: data.guestId,
          guestName: data.guestName,
          hostId: data.hostId,
          hostName: data.hostName,
          id: data.id,
          participants: data.participants,
        });
      }
    });
    setUserConversations(tmp);
  }, [user, loading, value]);

  const [currentConversation, setCurrentConversation] =
    useState<IConversation | null>(null);
  return (
    <UserConversationsContext.Provider
      value={{
        userConversations,
        setUserConversations,
        currentConversation,
        setCurrentConversation,
        userConversationsLoading,
        currentConversationLoading,
      }}
    >
      {children}
    </UserConversationsContext.Provider>
  );
};

export default userConversationsProvider;
