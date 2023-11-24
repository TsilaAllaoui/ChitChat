import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { db } from "../Firebase";
import "../styles/Action.scss";
import { ActionLabel } from "./Model/ActionModel";
import ConfirmationDialog from "./ConfirmationDialog";

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

  // **************** States ***************** /

  const [currentAction, setCurrentAction] = useState({
    method: (...params: any) => {},
  });

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
      {actions.map((action, i) => (
        <button
          key={action.label}
          onMouseEnter={(e) => {
            let a = e.currentTarget.style.backgroundColor
              .replace("rgb", "rgba")
              .replace(")", ",0.75)");
            e.currentTarget.style.backgroundColor = a;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = action.color;
          }}
          style={{ backgroundColor: action.color }}
          id={action.label}
          onClick={() => {
            if (action.label == "Delete") {
              setShowConfirmation(true);
              setCurrentAction({ method: actions[0].method });
            } else if (action.label == "Reply") {
              actions[1].method();
            } else console.log("Action not implemented yet!");
          }}
        >
          <action.icon />
          {action.label}
          <ConfirmationDialog
            header="Delete?"
            content="Do you really want to do this action?"
            show={showConfirmation}
            hide={() => setShowConfirmation(false)}
            action={() => currentAction.method(infos.content, infos.senderId)}
          />
        </button>
      ))}
    </div>
  );
}

export default Action;
