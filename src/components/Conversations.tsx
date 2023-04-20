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

function Conversations({
  setSender,
  setReceiver,
  setConvId,
}: {
  setSender: (param: {name: string, id: string}) => void;
  setReceiver: (param: {name: string, id: string}) => void;
  setConvId: (param: string) => void;
}) {
  // ************  States   ************

  // State for the conversations
  const [convs, setConvs] = useState<Conversation[]>([]);

  // State for user ID and name
  const [userId, setUserId] = useState("");

  // State for user name
  const [userName, setUserName] = useState("");

  // States for the user
  const [users, setUsers] = useState<User[]>([]);

  // State for showing popup
  const [showPopup, setShowPopup] = useState(false);

  // State for knowing if there is no conversations for current user
  const [noConvs, setNoConvs] = useState(false);

  // State for the user to create convs to
  const [newUser, setNewUser] = useState<ID>({name: "", id: ""})

  // ************* Contexts **************

  // ************  Effects   ************

  // Authentification and getting datas
  useEffect(() => {
    // Getting user infos
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        getData();
      } else console.log("Error getting user datas...");
    });

    // Getting users list
    const usersRef = collection(db, "users");
    onSnapshot(usersRef, (snapshot) => {
      let usersInFirebase: User[] = [];
      snapshot.forEach((doc: any) => {
        if (
          doc.data().uid !== userId &&
          !users.includes({ uid: doc.data().uid, name: doc.data().name })
        )
          usersInFirebase.push({ ...doc.data() });
      });
      // console.log(usersInFirebase);
      // console.log(users);
      setUsers(usersInFirebase);
    });
  }, [userId]);

  const add = () => {
    if (
      !showPopup &&
      newUser.name !== "" &&
      newUser.id !== ""
    ) {
      for (let user of users){
        if (user.uid === userId) setUserName(user.name);
      }
      const convsRef: any = collection(db, "conversations");
      const obj = {
        hostId: userId,
        hostName: userName,
        otherId: newUser.id,
        otherName: newUser.name,
        participants: [userId, newUser.id],
      };
      addDoc(convsRef, obj).then((docRef) => {
        const messRef: any = collection(db, "conversations", docRef.id, "mess");
        const mess = {
          senderId: userId,
          receiverId: newUser.id,
          message: "First message",
          sentTime: Timestamp.fromDate(new Date()),
        };
        addDoc(messRef, mess).then(() => {
          const tmp = convs;
          tmp.push(obj);
          setConvs(tmp);
          console.log(convs);
        });
      });
    }
  };

  // For adding new conversation
  useEffect(() => {
    getData()
    if (convs.length === 0)
      add();
    else
    {
      for (let d of convs)
      {
        if (d.otherId === newUser.id)
        {
          console.log("Not added");
          return;
        }
        else
        {
          console.log("Added");
          add();
        }
      }
    }
  }, [newUser]);

  // ************  Functions   ************

  // To get data from firebase
  const getData = () => {
    // Getting db
    const db = getFirestore();
    const convsRef: any = collection(db, "conversations");

    // Query for conversations only with the user id as the owner
    const q = query(convsRef, where("participants", "array-contains", userId));

    // Getting queried conversations datas
    onSnapshot(q, (snapshot) => {
      let convsInFirebase: any = [];
      snapshot.forEach((doc: any) => {
        convsInFirebase.push({ ...doc.data(), id: doc.id });
      });

      // Setting conversations
      setConvs(convsInFirebase);
      setNoConvs(convsInFirebase.length == 0);
    });
  };

  // For updating parent states
  const setProps = (conversation: Conversation) => {
    setReceiver({ name: conversation.hostName, id: conversation.hostId });
    setSender({ name: conversation.otherName, id: conversation.otherId });
    setConvId(conversation.id);
  };

  // For adding new conversation
  const addNewConversation = () => {
    setShowPopup(true);
  };

  // To delete conversation
  const deleteConversation = (conversation: Conversation) => {
    const db = getFirestore();

    const docRef = doc(db, "conversations", conversation.id);
    deleteDoc(docRef).then(() => {
      const messRef = collection(db, "conversations", conversation.id, "mess");
      getDocs(messRef).then((snapshot) => {
        snapshot.forEach((doc) => {
          deleteDoc(doc.ref).then(() => {});
        });
      });
    });

    setConvId("");
    setShowPopup(false);
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
                    key={conversation.id + Math.random() + Date.now()}
                    className="conversation"
                    onClick={() => setProps(conversation)}
                  >
                    {conversation.hostId !== userId
                      ? conversation.hostName
                      : conversation.otherName}
                    <button
                      className="delButton"
                      onClick={() => deleteConversation(conversation)}
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
          <button id="new-conv-button" onClick={addNewConversation}>
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
