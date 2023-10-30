import { useContext, useState } from "react";
import { RotateLoader } from "react-spinners";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import "../styles/Conversations.scss";
import Conversation from "./Conversation";

const Conversations = ({ loading }: { loading: boolean }) => {
  /************ States **************/

  const [toggleMenu, setToggleMenu] = useState(false);

  /************ Contexts **************/

  const user = useContext(UserContext).user;
  const { userConversations, setCurrentConversation } = useContext(
    UserConversationsContext
  );

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
            <Conversation conversation={conversation} />
          </div>
        ))
      )}
    </div>
  );
};

export default Conversations;
