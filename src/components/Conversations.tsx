import { getFirestore, collection, onSnapshot, query, where, getDocs, addDoc, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { userCreationContext } from "./Context";
import { Conversation, User } from "./Models";
import { ImSpinner10 } from "react-icons/im";
import "../styles/Conversations.scss";
import Popup from "./Popup";

function Conversations({setSender, setReceiver, setConvId}: {setSender: any, setReceiver: any, setConvId: any}) {

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
  const [showPopup, setShowPopup] = useState(false)

  // State for knowing if there is no conversations for current user
  const [noConvs, setNoConvs] = useState(false);

   // ************  Effects   ************

  // Authentification and getting datas
  useEffect(() => {
    
    console.log("In userId effect");
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        getData();
      } else console.log("Error getting user datas...");
    });
  }, [userId]);



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
    
    onSnapshot(usersRef, (snapshot) => {
    
        let usersInFirebase: User[] = [];
        snapshot.forEach((doc: any) => {
            usersInFirebase.push({ ...doc.data()});
        });
        setUsers(usersInFirebase);
      });
  };
  
  // For adding what to do after creating conversation
  const userToCreate = useContext(userCreationContext);
  useEffect(() => {
    if (!showPopup && userToCreate.userToBeCreated.name !== "" && userToCreate.userToBeCreated.id !== "")
    {
      console.log("In user create effect"); 
    const db = getFirestore();
    for (let user of users)
        if (user.uid === userId)
            setUserName(user.name);

    const convsRef: any = collection(db, "conversations");
    const obj = {
        hostId: userId,
        hostName: userName,
        otherId: userToCreate.userToBeCreated.id,
        otherName: userToCreate.userToBeCreated.name,
        participants: [userId, userToCreate.userToBeCreated.id],
    };
    addDoc(convsRef, obj).then((docRef) => {

      const messRef: any = collection(db, "conversations", docRef.id, "mess");
      const mess = {
          senderId: userId,
          receiverId: userToCreate.userToBeCreated.id,
          message: "First message",
          sentTime: Timestamp.fromDate(new Date())
      };
      addDoc(messRef, mess).then(() => {
        console.log("added conv+mess")
      }).catch((err) => {
        console.log("error adding conv+mess")
      });
      
    }).catch((ERR) => {
      console.log("error adding conv+mess")
    });
    }
    
  }, [showPopup]);


  // To delete conversation
  const deleteConversation = (conversation: Conversation) => {

    const db = getFirestore();

    const docRef = doc(db, "conversations", conversation.id);
    deleteDoc(docRef).then(() => {
      const messRef = collection(db, "conversations", conversation.id, "mess");
      getDocs(messRef).then((snapshot) => {
        snapshot.forEach((doc) => {
              deleteDoc(doc.ref).then(() => {
        });
      });
    })
  })

  setConvId("");
  setShowPopup(false);

}
  
 // ************  Rendering   ************

  return (
    <div id="conversation-root">
      <h1>Conversations</h1>
      {convs.length > 0 ? (
        <ul id="conversation-list">
          {convs && convs.map((conversation: Conversation) => {
            return (
              <li key={conversation.id + Date.now()} className="conversation" onClick={() => setProps(conversation)}>
                    {conversation.hostId !== userId ? conversation.hostName : conversation.otherName}
                    <button className="delButton" onClick={() => deleteConversation(conversation)}>Delete</button>
              </li>
            );
          })}
        </ul>
      ) : ( noConvs ? null : 
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
