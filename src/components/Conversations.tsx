import { useContext, useEffect, useState } from "react";
import { RotateLoader } from "react-spinners";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import Action from "./Action";
import { AiFillDelete } from "react-icons/ai";
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

  useEffect(() => {
    if (toggleMenu) {
    }
  }, [toggleMenu]);

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
          <div id="conversation-container">
            <div
              className="conversation"
              key={conversation.id}
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
