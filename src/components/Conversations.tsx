import { getFirestore, collection, onSnapshot, query, where, getDocs, addDoc, FieldValue, Timestamp, CollectionReference } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ImSpinner10 } from "react-icons/im";
import { useState, useEffect, useContext } from "react";
import "../styles/Conversations.scss";
import Popup from "./Popup";
import { User } from "./Models";
import { userCreationContext } from "./Context";

function Conversations({setSender, setReceiver, setConvId}: {setSender: any, setReceiver: any, setConvId: any}) {

  // Type for a conversation object
  type Conversation = { participants: string[]; hostName: string; hostId: string, otherName: string, otherId: string, id: string };

  // State for the conversations
  const [convs, setConvs] = useState<Conversation[]>([]);

  // State for user ID and name
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  // States for the user
  const [users, setUsers] = useState<User[]>([]);

  // State for showing popup
  const [showPopup, setShowPopup] = useState(false)

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

    // Getting queried conversations datas
    onSnapshot(q, (snapshot) => {
    
      let convsInFirebase: any = [];
      snapshot.forEach((doc: any) => {
        convsInFirebase.push({ ...doc.data(), id: doc.id });
      });

      // Setting conversations
      setConvs(convsInFirebase);
    });
  };

  // For updating parent states
  const setProps = (conversation: Conversation) => {
    setReceiver({name: conversation.hostName,id: conversation.hostId});
    setSender({name: conversation.otherName,id: conversation.otherId});
    setConvId(conversation.id);
  };

  // For adding new conversation
  const addNewConversation = () => {

    const auth = getAuth();
    const db = getFirestore();
    const usersRef = collection(db, "users");

    setShowPopup(true);
    
    getDocs(usersRef).then((snapshot) => {
    
        let usersInFirebase: User[] = [];
        snapshot.forEach((doc: any) => {
            usersInFirebase.push({ ...doc.data()});
        });
        setUsers(usersInFirebase);
      });
  };
  


















  const userToCreate = useContext(userCreationContext);
  useEffect(() => {

    const db = getFirestore();
    const convsRef: any = collection(db, "conversations");

    for (let user of users)
        if (user.uid === userId)
            setUserName(user.name);

    const obj = {
        hostId: userId,
        hostName: userName,
        otherId: userToCreate.userToBeCreated.id,
        otherName: userToCreate.userToBeCreated.name,
        participants: [userId, userToCreate.userToBeCreated.id],
        mess: {
            message: "First message!",
            receiverId: userToCreate.userToBeCreated.id,
            senderId: userId,
            sentTime: Timestamp.fromDate(new Date())
        }
    };

    addDoc(convsRef, obj);
    const newConvsRef = collection(db, "conversations");
    const q = query(newConvsRef, where("hostId", "==", userId), where("otherId", "==", userToCreate.userToBeCreated.id));


    onSnapshot(q, (snapshot) => {
    
        
      });
    
  }, [userToCreate.userToBeCreated]);














  
  return (
    <div id="conversation-root">
      <h1>Conversations</h1>
      {convs.length > 0 ? (
        <ul id="conversation-list">
          {convs.map((conversation: Conversation) => {
            return (
              <li key={userId + conversation.id} className="conversation" onClick={() => setProps(conversation)}>
                    {conversation.hostId !== userId ? conversation.hostName : conversation.otherName}
              </li>
            );
          })}
        </ul>
      ) : (
        <ImSpinner10 className="spinner"/>
      )}
      <div>
        <button id="new-conv-button" onClick={addNewConversation}>New Conversation</button>
      </div>
      {showPopup ? <Popup setPopupState={setShowPopup} users={users}/> : null}
    </div>
  );
}

export default Conversations;
