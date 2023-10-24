import { useContext } from "react";
import { RotateLoader } from "react-spinners";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import UserList from "./UserList";

const Conversations = ({ loading }: { loading: boolean }) => {
  const { userConversations, setCurrentConversation } = useContext(
    UserConversationsContext
  );
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
      <UserList />
    </div>
  );
};

export default Conversations;
