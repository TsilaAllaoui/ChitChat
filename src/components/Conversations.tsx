import React, { useContext } from "react";
import { RotateLoader } from "react-spinners";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { UserContext } from "../Contexts/UserContext";

const Conversations = ({ loading }: { loading: boolean }) => {
  const {
    userConversations,
    setUserConversations,
    currentConversation,
    setCurrentConversation,
  } = useContext(UserConversationsContext);
  const user = useContext(UserContext).user;
  return (
    <div id="convsersations-section">
      <h1>Conversations</h1>
      {loading ? (
        <RotateLoader
          size={15}
          color="#ffffff"
          speedMultiplier={0.5}
          id="conversations-loading"
        ></RotateLoader>
      ) : (
        userConversations.map((conversation) => (
          <div
            className="conversation"
            key={conversation.id}
            onClick={(e) => setCurrentConversation(conversation)}
          >
            {user!.uid == conversation.hostId
              ? conversation.guestName
              : conversation.hostName}
          </div>
        ))
      )}
    </div>
  );
};

export default Conversations;
