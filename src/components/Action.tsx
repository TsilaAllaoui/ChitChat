import { ActionLabel } from "./Model/ActionModel";
import "../styles/Action.scss";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Action({
  actions,
  infos,
}: {
  actions: ActionLabel[];
  infos: {
    content: string;
    senderId: string;
    receiverId: string;
  };
}) {

  // ************ Variables ************
  let height = actions.length * 20;


  // *********** Redux ***************

  const currentConvId = useSelector(
    (state: RootState) => state.currentConvId.id
  );

  // To delete message entry
  const deleteMessageEntry = () => {
    getDocs(collection(db, "conversations", currentConvId, "mess")).then(
      (snap) => {
        snap.forEach((doc) => {
          const data = { ...doc.data() };
          if (
            data.message === infos.content &&
            data.senderId === infos.senderId &&
            data.receiverId === infos.receiverId
          )
            deleteDoc(doc.ref);
        });
      }
    );
  };

  return (
    <div
      className="dropdown"
      style={{ height: height.toString() + "px", transition: "opacity 750ms", opacity: "0" }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0";
      }}
    >
      {actions.map((action) => {
        return (
          <button
            id={action.label}
           onClick={() => {
            if (action.label === "Delete")
              deleteMessageEntry();
          }}>
            <action.icon />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

export default Action;
