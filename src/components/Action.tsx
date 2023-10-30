import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { useState } from "react";
import { createPortal } from "react-dom";
import { db } from "../Firebase";
import "../styles/Action.scss";
import { ActionLabel } from "./Model/ActionModel";

function Action({
  actions,
  hideAction,
  currentConversationId,
  infos,
}: {
  actions: ActionLabel[];
  hideAction: () => void;
  currentConversationId: string;
  infos: {
    content: string;
    senderId: string;
  };
}) {
  // ************ Variables ************
  let height = actions.length * 20;
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ************* Functions

  // To delete message entry
  const deleteMessageEntry = () => {
    getDocs(
      collection(db, "conversations", currentConversationId, "mess")
    ).then((snap) => {
      snap.forEach((doc) => {
        const data = { ...doc.data() };
        if (data.message === infos.content && data.senderId === infos.senderId)
          deleteDoc(doc.ref);
      });
    });
  };

  const replyMessageEntry = () => {
    /*TODO*/
  };

  // **************** Rendering ************************

  return (
    <div
      className="dropdown"
      style={{
        height: (actions.length * 30).toString() + "px",
      }}
      onMouseLeave={(e) => {
        hideAction();
      }}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          onMouseEnter={(e) => {
            let a = e.currentTarget.style.backgroundColor
              .replace("rgb", "rgba")
              .replace(")", ",0.75)");
            e.currentTarget.style.backgroundColor = a;
            console.log(a);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = action.color;
          }}
          style={{ backgroundColor: action.color }}
          id={action.label}
          onClick={() => {
            if (action.label === "Delete") {
              setShowConfirmation(true);
            } else if (action.label === "Reply") replyMessageEntry();
          }}
        >
          <action.icon />
          {action.label}
        </button>
      ))}
      {showConfirmation
        ? createPortal(
            <>
              <div id="confirmation" onClick={() => setShowConfirmation(false)}>
                <div id="container" onClick={(e) => e.stopPropagation()}>
                  <h1>Delete message?</h1>
                  <div id="separator"></div>
                  <h2>
                    This action is irreversible. Proceed carrefully before
                    choosing.
                  </h2>
                  <div id="buttons">
                    <button onClick={() => deleteMessageEntry()}>Yes</button>
                    <button
                      onClick={() => {
                        setShowConfirmation(false);
                        hideAction();
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </>,
            document.getElementById("portal") as HTMLElement
          )
        : null}
    </div>
  );
}

export default Action;
