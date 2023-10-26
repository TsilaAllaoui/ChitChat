import { useContext, useState } from "react";
import { RotateLoader } from "react-spinners";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import "../Styles/Conversations.scss";
import ConversationAction from "./ConversationAction";

const Conversations = ({ loading }: { loading: boolean }) => {
  /************ States **************/

  const [toggleMenu, setToggleMenu] = useState(false);

  /************ Contexts **************/

  const user = useContext(UserContext).user;
  const { userConversations, setCurrentConversation } = useContext(
    UserConversationsContext
  );

  /************ Effects **************/

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
          <div id="conversation-container" key={conversation.id}>
            <div
              className="conversation"
              onClick={(e) => setCurrentConversation(conversation)}
            >
              <p>
                {user!.uid == conversation.hostId
                  ? conversation.guestName
                  : conversation.hostName}
              </p>
            </div>
            <ConversationAction conversationId={conversation.id} />
          </div>
        ))
      )}
    </div>
  );
};

export default Conversations;
