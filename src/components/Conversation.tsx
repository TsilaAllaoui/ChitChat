import { collection, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { db } from "../Firebase";
import "../styles/Conversation.scss";
import ConversationAction from "./ConversationAction";
import { IConversation } from "./MainPage";

const Conversation = ({ conversation }: { conversation: IConversation }) => {
  /************ States **************/

  const [picture, setPicture] = useState("");

  /************ Contexts **************/

  const user = useContext(UserContext).user;
  const { userConversations, setCurrentConversation } = useContext(
    UserConversationsContext
  );

  /************ Functions **************/

  const loadProfilePicture = () => {
    const id =
      user?.uid == conversation.hostId
        ? conversation.guestId
        : conversation.hostId;
    getDocs(query(collection(db, "users"))).then((docs) => {
      docs.forEach((doc) => {
        if (doc.data().uid == id) {
          const element = document.querySelector(
            "#" + conversation.id
          ) as HTMLElement;
          element.style.backgroundImage =
            doc.data().picture && doc.data().picture != ""
              ? `url(${doc.data().picture})`
              : "";
          setPicture(doc.data().picture);
        }
      });
    });
  };

  /************ Effects **************/

  useEffect(() => {
    loadProfilePicture();
  }, [user, userConversations]);

  return (
    <>
      <div
        className="conversation"
        onClick={(e) => setCurrentConversation(conversation)}
      >
        <div id={conversation.id} className="picture">
          {picture == "" || picture == undefined ? <BiUser /> : null}
        </div>
        <p>
          {user!.uid == conversation.hostId
            ? conversation.guestName
            : conversation.hostName}
        </p>
      </div>
      <ConversationAction conversationId={conversation.id} />
    </>
  );
};

export default Conversation;
