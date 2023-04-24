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
  setSender,
  setReceiver,
  hostId,
  hostName,
}: {
  setSender: (param: { name: string; id: string }) => void,
  setReceiver: (param: { name: string; id: string }) => void,
  setConvId: (param: string) => void,
  hostId: string,
  hostName: string,
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
  const [convList, loading, error] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [allConvs, l, e] = useCollection(convsRef, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });

  // ************  Effects   ************

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        getData();
      }
    });
    // onSnapshot(collection(db, "conversations"), () => {
    //   getData();
    // });
  }, []);

  useEffect(() => {
    addNewConversation(newUser);
  }, [newUser]);

  useEffect(() => {
    getData();
  }, [convList, allConvs])

  // ************  Functions   ************

  // To add new conversation
  const addNewConversation = (user: ID) => {
    if (user.uid === "" || user.name === "") return;

    let pass = false;

    for (let c of convs) {
      if (c.otherId === user.uid) {
        pass = true;
        break;
      }
    }

    const conv: Conversation = {
      participants: [hostId, user.uid],
      hostName: hostName,
      hostId: hostId,
      otherName: user.name,
      otherId: user.uid,
      id: "",
    };

    if (!pass) {
      const convsRef: any = collection(db, "conversations");
      const obj = {
        hostId: hostId,
        hostName: hostName,
        otherId: user.uid,
        otherName: user.name,
        participants: [hostId, user.uid]
      };
      addDoc(convsRef, obj).then((docRef)=> {
        updateDoc(doc(db, "conversations", docRef.id), {
          id: docRef.id
        }).then(() => {
          addDoc(collection(db, "conversations", docRef.id, "mess"), {
            receiverId: user.uid,
            senderId: hostId,
            message: "First message",
            hostId: hostId
          })
        })
        getDocs(collection(db, "conversations")).then((snapshot) => {
          let list: any[] = [];
          snapshot.forEach((doc) => {
            list.push({...doc.data(), id: doc.data().id});
          })
          setConvs(list);
        });
      })
      getData();
    }
  };

  // To delete conversation
  const deleteConversation = async (conversation: Conversation) => {

    const docRef = doc(db, "conversations", conversation.id);
    await deleteDoc(docRef);
    const messRef = collection(db, "conversations", conversation.id, "mess");
    const snapshot = await getDocs(messRef);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    });
    setConvId("");
    setShowPopup(false);
  };

  // To get datas
  const getData = () => {
    if (convList?.docs.length === 0)
    {
      setNoConvs(true);
      setConvs([]);
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

  // Updating messages for current discussion
   const setProps = (conversation: Conversation) => {
    setReceiver({name: conversation.hostName,id: conversation.hostId});
    setSender({name: conversation.otherName,id: conversation.otherId});
    setConvId(conversation.id);
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
                <li key={conversation.id + Math.random() + Date.now()} 
                className="conversation" 
                onClick={() => setProps(conversation)}>
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
