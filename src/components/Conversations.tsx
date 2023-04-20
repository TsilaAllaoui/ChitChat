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
  or,
  setDoc,
  updateDoc,
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
  hostName,
}: {
  setSender: (param: { name: string; id: string }) => void;
  setReceiver: (param: { name: string; id: string }) => void;
  setConvId: (param: string) => void;
  hostId: string;
  hostName: string;
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
  const [newUser, setNewUser] = useState<ID>({ name: "", uid: "" });

  const [convId, setConvId] = useState("");

  // ************* Firebase Hooks **************

  const convsRef = collection(db, "conversations");
  const q = query(convsRef, where("participants", "array-contains", hostId)); 
  const [convList, loading, error] = useCollection(q);

  // ************  Effects   ************

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        getData();
      }
    });
  }, []);

  useEffect(() => {
    addNewConversation(newUser);
  }, [newUser]);

  useEffect(() => {
    getData();
  }, [convList])

  // ************  Functions   ************

  // To add new conversation
  const addNewConversation = (user: ID) => {
    console.log("when add", user);
    if (user.uid === "" || user.name === "") return;

    const conv: Conversation = {
      participants: [userId, user.uid],
      hostName: hostName,
      hostId: userId,
      otherName: user.name,
      otherId: user.uid,
      id: "",
    };

    let pass = false;

    for (let c of convs) {
      if (c.otherId === conv.otherId) {
        console.log("pass")
        pass = true;
        break;
      }
    }

    if (!pass) {
      const convsRef: any = collection(db, "conversations");
      const obj = {
        hostId: userId,
        hostName: userName,
        otherId: user.uid,
        otherName: user.name,
        participants: [userId, user.uid]
      };
      addDoc(convsRef, obj).then((docRef)=> {
        updateDoc(doc(db, "conversations", docRef.id), {
          id: docRef.id
        }).then(() => {
          addDoc(collection(db, "conversations", docRef.id, "mess"), {
            receiverId: user.uid,
            senderId: userId,
            message: "First message",
            hostId: userId
          })
        })
      })
    }
  };

  // To delete conversation
  const deleteConversation = (conversation: Conversation) => {
    console.log(conversation.id);

    const docRef = doc(db, "conversations", conversation.id);
    deleteDoc(docRef).then(() => {
      const messRef = collection(db, "conversations", conversation.id, "mess");
      getDocs(messRef).then((snapshot) => {
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref).then(() => {}).catch((err) => console.log("ERROR ", err));;
        });
      });
    }).catch((err) => console.log("ERROR ", err));
    setConvId("");
    setShowPopup(false);
  };

  // To get datas
  const getData = () => {
    if (convList?.docs.length === 0)
    {
      setNoConvs(true);
      return;
    }
    let list: any[] = [];
    convList?.docs.forEach ((doc) => {
        list.push({ ...doc.data() , id: doc.id});
      if (list.length === 0) setNoConvs(true);
      else setConvs(list);
    });
  };

  // To toggle modal form
  const togglePopup = () => {
    setShowPopup(true);
  };

  // ************  Rendering   ************

  return (
    <div id="conversation-root">
      <h1>Conversations</h1>
      {convs.length > 0 ? (
        <ul id="conversation-list">
          {convs &&
            convs.map((conversation: Conversation) => {
              return (
                <li key={Math.random() + Date.now()} className="conversation">
                  {conversation.hostId !== userId
                    ? conversation.hostName
                    : conversation.otherName}
                  <button className="delButton" onClick={() => deleteConversation(conversation)}>
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
        <button id="new-conv-button" onClick={togglePopup}>
          New Conversation
        </button>
      </div>
      {showPopup ? (
        <Popup
          setPopupState={setShowPopup}
          setNewUser={setNewUser}
          hostId={userId}
        />
      ) : null}
    </div>
  );
}

export default Conversations;
