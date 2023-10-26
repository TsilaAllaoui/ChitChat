import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import "../Styles/ConverstationAction.scss";
import ConfirmationDialog from "./ConfirmationDialog";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

const ConversationAction = ({ conversationId }: { conversationId: string }) => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteConversation = () => {
    console.log(conversationId);
    getDocs(collection(db, "conversations")).then((snap) => {
      snap.forEach((doc) => {
        const data = { ...doc.data() };
        if (data.id === conversationId) deleteDoc(doc.ref);
      });
    });
  };

  return (
    <div className="dots">
      <BsThreeDotsVertical id="icon" onClick={() => setToggleMenu(true)} />
      {toggleMenu ? (
        <div
          style={{ opacity: "1" }}
          id="action-container"
          onClick={() => setShowConfirmation(true)}
          onMouseLeave={() => {
            const action = document.querySelector(
              "#action-container"
            ) as HTMLElement;
            action.style.animation = "fade-out 500ms";
            setTimeout(() => setToggleMenu(false), 500);
          }}
        >
          <div id="arrow"></div>
          <AiFillDelete />
          <p>Delete</p>
        </div>
      ) : null}
      <ConfirmationDialog
        show={showConfirmation}
        hide={() => setShowConfirmation(false)}
        action={deleteConversation}
      />
    </div>
  );
};

export default ConversationAction;
