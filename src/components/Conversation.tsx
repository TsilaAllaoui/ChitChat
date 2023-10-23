import { useCollection } from "react-firebase-hooks/firestore";
import { IConversation } from "./MainPage";
import { collection, or, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useEffect } from "react";

const Conversation = ({ conversation }: { conversation: IConversation }) => {
  // ************  Firestore hooks   ************

  const [value, loading, error] = useCollection(
    query(
      collection(db, "conversations"),
      or(
        where("hostId", "==", conversation.hostId),
        where("guestId", "==", conversation.guestId)
      )
    )
  );

  return (
    <>
      {
        // value && value.map((message) => )
      }
    </>
  );
};

export default Conversation;
