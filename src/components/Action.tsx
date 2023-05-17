import { ActionLabel } from "./Model/ActionModel";
import "../styles/Action.scss";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { updateReplyMessage } from "../redux/slices/replyMessageSlice";

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

  const currentReply = useSelector(
    (state: RootState) => state.reply.replyMessage
  );

  const dispatch = useDispatch();

  // ************* Functions

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

  const replyMessageEntry = () => {
    dispatch(
      updateReplyMessage({
        message: infos.content,
        senderName: "",
      })
    );
    console.log("After update: ", currentReply);
  };

  // **************** Rendering ************************

  return (
    <div
      className="dropdown"
      style={{
        height: height.toString() + "px",
        transition: "opacity 750ms",
        opacity: "0",
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "0";
      }}
    >
      {actions.map((action) => {
        return (
          <button
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
