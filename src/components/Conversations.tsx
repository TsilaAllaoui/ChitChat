import {
  getFirestore,
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../Firebase";
import { ImSpinner10 } from "react-icons/im";
import "../styles/Conversations.scss";

function Conversations({setSender, setReceiver}: {setSender: any, setReceiver: any}) {
  // Type for a conversation object
  type Conversation = { participants: string[]; hostName: string; hostId: string, otherName: string, otherId: string, id: string };

  // Hook for the conversations
  const [convs, setConvs] = useState<Conversation[]>([]);

  // State for user ID
  const [userId, setUserId] = useState("");

  // Authentification and getting datas
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        getData();
      } else console.log("Error getting user datas...");
    });
  }, [userId]);

  // To get data from firebase
  const getData = () => {
    // Getting db
    const db = getFirestore();
    const convsRef: any = collection(db, "conversations");

    // Query for conversations only with the user id as the owner
    const q = query(convsRef, where("participants", "array-contains", userId));

    // Getting only conversations for the current user
    onSnapshot(q, (snapshot) => {
      // setConvs([{ owner: "", timeStamp: Timestamp.now(), message: "", id:"" }]);
      let convsInFirebase: any = [];
      snapshot.forEach((doc: any) => {
        convsInFirebase.push({ ...doc.data(), id: doc.id });
      });

      // Setting conversations
      setConvs(convsInFirebase);
    });
  };

  const setProps = (conversation: Conversation) => {
    console.log(conversation);
    setReceiver({name: conversation.hostName,id: conversation.hostId});
    setSender({name: conversation.otherName,id: conversation.otherId});
  };

  return (
    <div id="conversation-root">
      <h1>Conversations</h1>
      {convs.length > 0 ? (
        <ul id="conversation-list">
          {convs.map((conversation: Conversation) => {
            return (
              <li key={userId + conversation.id} className="conversation" onClick={setProps}>
                {conversation.hostId === userId ? conversation.hostName : conversation.otherName}
              </li>
            );
          })}
        </ul>
      ) : (
        <ImSpinner10 className="spinner"/>
      )}
    </div>
  );
}

export default Conversations;
