import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  Timestamp,
  or
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { UserContext } from "./Context";
import { Conversation, User } from "./Models";
import { ImSpinner10 } from "react-icons/im";
import "../styles/Conversations.scss";
import Popup from "./Popup";
import { auth, db } from "../Firebase";
import { ID } from "./Models";
import { useCollection } from "react-firebase-hooks/firestore";

function Conversations({
  hostId,
  hostName
}: {
  setSender: (param: {name: string, id: string}) => void,
  setReceiver: (param: {name: string, id: string}) => void,
  setConvId: (param: string) => void,
  hostId: string,
  hostName: string
}) {
  // ************  States   ************

  // State for the conversations
  const [convs, setConvs] = useState<Conversation[]>([]);

  // State for user ID and name
  const [userId, setUserId] = useState("");

  // State for user name
  const [userName, setUserName] = useState(hostName);

  // State for showing popup
  const [showPopup, setShowPopup] = useState(false);

  // State for knowing if there is no conversations for current user
  const [noConvs, setNoConvs] = useState(false);

  // State for the user to create convs to
  const [newUser, setNewUser] = useState<ID>({name: "", id: ""})



  // ************* Firebase Hooks **************

  // ************  Effects   ************

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) 
      {
        setUserId(user.uid);
        getData();
      }
    });
  }, []);

  useEffect(() => {
    console.log(newUser);
    addNewConversation(newUser);
  }, [newUser])

  // ************  Functions   ************

  const addNewConversation = (user: ID) => {
    if (user.id === "" || user.name === "")
      return;

    const conv: Conversation = {
      participants: [userId, user.id],
      hostName: hostName,
      hostId: userId,
      otherName: user.name,
      otherId: user.id,
      id: Date.now().toString()
    };

    let pass = false;
    
    for (let c of convs)
    {
      if (c.otherId === conv.otherId || c.otherId === conv.hostId)
      {
        console.log("already in");
        pass = true;
        break;
      }
    }

    if (!pass)
    {
      console.log("Added");
      // const convsRef: any = collection(db, "conversations");
      // const obj = {
      //   hostId: userId,
      //   hostName: userName,
      //   otherId: newUser.id,
      //   otherName: newUser.name,
      //   participants: [userId, newUser.id],
      // };
      // addDoc(convsRef, obj).then((docRef) => {
      //   const messRef: any = collection(db, "conversations", docRef.id, "mess");
      //   const mess = {
      //     senderId: userId,
      //     receiverId: newUser.id,
      //     message: "First message",
      //     sentTime: Timestamp.fromDate(new Date()),
      //   };
      //   addDoc(messRef, mess).then(() => {
      //     const tmp = convs;
      //     tmp.push(obj);
      //     setConvs(tmp);
      //     console.log(convs);
      //   });
      // });
    }
    getData();    

  };
  

  const getData = () => {
    const ref = collection(db, "conversations");
    console.log(hostId);
    const q = query(ref, where("participants", "array-contains", userId));
    let list: Conversation[] = [];
    onSnapshot(q, (snapshot) => {
      snapshot.forEach((doc) => {
        list.push({...doc.data()});
      });
      if (list.length === 0)
        setNoConvs(true);
      else setConvs(list);
        console.log(list);
    })
  };
  
  const togglePopup = () => {
    setShowPopup(true);
  };



  // ************  Rendering   ************

  return (
    <div id="conversation-root">
      <div>{newUser.name} : {newUser.id}</div>
        <h1>Conversations</h1>
        {convs.length > 0 ? (
          <ul id="conversation-list">
            {convs &&
              convs.map((conversation: Conversation) => {
                return (
                  <li
                    key={Math.random() + Date.now()}
                    className="conversation"
                  >
                    {conversation.hostId !== userId
                      ? conversation.hostName
                      : conversation.otherName}
                    <button
                      className="delButton"
                      onClick={deleteConversation}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
          </ul>
        ) : noConvs ? null : (
          <ImSpinner10 className="spinner" />
        )}
        <div>
          <button id="new-conv-button"
                  onClick={togglePopup}
          >
            New Conversation
          </button>
        </div>
        {showPopup ? (
            <Popup setPopupState={setShowPopup} setNewUser={setNewUser} hostId={userId} />
        ) : null}
      </div>
  );
}

export default Conversations;
