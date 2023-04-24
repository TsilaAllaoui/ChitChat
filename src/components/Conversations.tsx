import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { update } from "../redux/slices/userSlice";
import { updateChosenUser } from "../redux/slices/chosenUserSlice";
import { set } from "../redux/slices/popUpSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation, UserInFirebase } from "./Models";
import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, or, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";
import Popup from "./Popup";
import { setCurrentConvId } from "../redux/slices/currentConversationSlice";

function Conversations() {

  const name = useSelector((state: RootState) => state.user.name);
  const id = useSelector((state: RootState) => state.user.id);
  const popUpState = useSelector((state: RootState) => state.popUp.popUpShown);
  const chosenUser = useSelector((state: RootState) => state.chosenUser.chosenUser);
  const dispatch = useDispatch();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const convsRef = collection(db, "conversations");
  const q = query(convsRef, or(where("hostId", "==", id), where("guestId","==",id)));
  const [conversationsInFirestore, loading, error] = useCollection(q);

  useEffect(() => {
    let tmp: any[] = [];
    conversationsInFirestore?.docs.forEach((doc) => {
      tmp.push({...doc.data(), id: doc.data().id})
    })
    setConversations(tmp);
    if (conversationsInFirestore?.docs.length === 0)
    {
      console.log("In effect");
      dispatch(setCurrentConvId(""))
    }
  }, [conversationsInFirestore]);

  useEffect(() => {
    if (!popUpState && chosenUser.id != "" && chosenUser.name != "")
    {
      addNewConversation();
      dispatch(updateChosenUser({
        name: "",
        email: "",
        id: ""
      }));
    }
  }, [popUpState]);

  const showPopup = () => {
    dispatch(set(true));
  };

  const addNewConversation = () => {

    const user: UserInFirebase = chosenUser;
    if (user.id === "" || user.name === "")
    {
      console.log("empty chosen user")
      return;
    } 
      
    let pass = false;
    conversationsInFirestore?.docs.forEach((doc) => {
      const data: any = {...doc.data(), id: doc.data().id};
      if (data.guestId === user.id)
        pass = true;
    });

    let newConvId: string = "";
    if (!pass) {
      const conv: Conversation = {
        participants: [id, user.id],
        hostName: name,
        hostId: id,
        guestName: user.name,
        guestId: user.id,
        id: "",
      };
      const convsRef: any = collection(db, "conversations");
      addDoc(convsRef, conv).then((docRef) => {
        updateDoc(doc(db, "conversations", docRef.id), {
          id: docRef.id
        }).then(() => {
          newConvId = docRef.id;
          addDoc(collection(db, "conversations", docRef.id, "mess"), {
                    receiverId: user.id,
                    senderId: id,
                    message: "First message",
                    hostId: id,
                    sentTime: serverTimestamp()
                  }).then(() => {

                    if (conversations.length === 0)
                      dispatch(setCurrentConvId(newConvId));
                  });
        });
      })
    }
  };

  const deleteConversation = (conversation: Conversation) => {
    conversationsInFirestore?.docs.forEach((doc) => {
      const data = {...doc.data(), id: doc.data().id};
      if (data.id === conversation.id)
      {
        deleteDoc(doc.ref).then(() => {
          if (conversationsInFirestore.docs.length === 0)
          {
            console.log("IS 0");
            dispatch(setCurrentConvId(""));
          }
        });
      }
    })
  };

  const loadMessages = (conversation: Conversation) => {
    console.log("Here")
    const _id = conversation.guestId !== id ? conversation.guestId : conversation.hostId;
    const _name = conversation.guestName !== name ? conversation.guestName : conversation.hostName;
    dispatch(updateChosenUser({
      name: _name,
      id: _id,
      email: ""
    }))
    dispatch(setCurrentConvId(conversation.id)); 
  }

  return (
    <div>
      <div>Conversations</div>
      <div>User: {name} {id}</div>
      <div>
         {error && <p>{JSON.stringify(error)}</p>}
         {loading && <p>Loading...</p>}
          {conversationsInFirestore && <ul>
          {
            conversations.map((conversation: Conversation) => {
              return <li 
                        key={conversation.id + Math.random() + Date.now()}
                        onClick={() => loadMessages(conversation)}
                        >
                {conversation.guestId !== id ? conversation.guestName : conversation.hostName}
                <button onClick={() => deleteConversation(conversation)}>Delete</button>
                </li>
            })
          }
        </ul>}
      </div>
      <button onClick={showPopup}>Add conversation</button>
      {
        !popUpState ? null :
        <Popup/>
      }
    </div>
  )
}

export default Conversations;