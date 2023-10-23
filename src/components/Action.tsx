import { collection, deleteDoc, getDocs } from "firebase/firestore";
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
      {actions.map((action) => {
        return (
          <button
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
              if (action.label === "Delete") deleteMessageEntry();
              else if (action.label === "Reply") replyMessageEntry();
            }}
          >
            <action.icon />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

export default Action;
