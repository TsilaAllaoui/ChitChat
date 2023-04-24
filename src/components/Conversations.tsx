import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  or,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { setCurrentConv } from "../redux/slices/currentConversationSlice";
import { updateChosenUser } from "../redux/slices/chosenUserSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation, UserInFirebase } from "./Models";
import { AppDispatch, RootState } from "../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { BiMessageSquareAdd } from "react-icons/bi";
import { onAuthStateChanged } from "firebase/auth";
import { update } from "../redux/slices/userSlice";
import { set } from "../redux/slices/popUpSlice";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { getInitiials } from "./Modules";
import { auth, db } from "../Firebase";
import "../styles/Conversations.scss";
import Popup from "./Popup";

function Conversations() {
  const name = useSelector((state: RootState) => state.user.name);
  const id = useSelector((state: RootState) => state.user.id);
  const popUpState = useSelector((state: RootState) => state.popUp.popUpShown);
  const chosenUser = useSelector(
    (state: RootState) => state.chosenUser.chosenUser
  );
  const dispatch = useDispatch();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  //   {
  //     participants: ["Participant1, Participant2"],
  //     hostName: "Tsila",
  //     hostId: "123",
  //     guestName: "Ariane",
  //     guestId: "456",
  //     id: "123",
  //   },
  //   {
  //     participants: ["Participant1, Participant2"],
  //     hostName: "Tsila",
  //     hostId: "123",
  //     guestName: "Kal",
  //     guestId: "456",
  //     id: "123",
  //   },
  //   {
  //     participants: ["Participant1, Participant2"],
  //     hostName: "Tsila",
  //     hostId: "123",
  //     guestName: "Allaoui",
  //     guestId: "456",
  //     id: "123",
  //   },
  // ]);
  const convsRef = collection(db, "conversations");
  const q = query(
    convsRef,
    or(where("hostId", "==", id), where("guestId", "==", id))
  );
  const [conversationsInFirestore, loading, error] = useCollection(q);

  useEffect(() => {
    let tmp: any[] = [];
    conversationsInFirestore?.docs.forEach((doc) => {
      tmp.push({ ...doc.data(), id: doc.data().id });
    });
    setConversations(tmp);
    if (conversationsInFirestore?.docs.length === 0) {
      dispatch(setCurrentConv({ id: "", guestName: "", hostId: "" }));
    }
  }, [conversationsInFirestore]);

  useEffect(() => {
    if (!popUpState && chosenUser.id != "" && chosenUser.name != "") {
      addNewConversation();
      dispatch(
        updateChosenUser({
          name: "",
          email: "",
          id: "",
        })
      );
    }
  }, [popUpState]);

  const showPopup = () => {
    dispatch(set(true));
  };

  const addNewConversation = () => {
    const user: UserInFirebase = chosenUser;
    if (user.id === "" || user.name === "") {
      return;
    }

    let pass = false;
    conversationsInFirestore?.docs.forEach((doc) => {
      const data: any = { ...doc.data(), id: doc.data().id };
      if (data.guestId === user.id) pass = true;
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
          id: docRef.id,
        }).then(() => {
          newConvId = docRef.id;
          addDoc(collection(db, "conversations", docRef.id, "mess"), {
            receiverId: user.id,
            senderId: id,
            message: "First message",
            hostId: id,
            sentTime: serverTimestamp(),
          }).then(() => {
            if (conversations.length === 0)
              dispatch(setCurrentConv({ id: newConvId, guestName: user.id, hostId: id }));
          });
        });
      });
    }
  };

  const deleteConversation = (conversation: Conversation) => {
    conversationsInFirestore?.docs.forEach((doc) => {
      const data = { ...doc.data(), id: doc.data().id };
      if (data.id === conversation.id) {
        deleteDoc(doc.ref).then(() => {
          if (conversationsInFirestore.docs.length === 0) {
            dispatch(setCurrentConv({ id: "", guestName: "", hostId:"" }));
          }
        });
      }
    });
  };

  const loadMessages = (conversation: Conversation) => {
    const _id =
      conversation.guestId !== id ? conversation.guestId : conversation.hostId;
    const _name =
      conversation.guestName !== name
        ? conversation.guestName
        : conversation.hostName;
    dispatch(
      updateChosenUser({
        name: _name,
        id: _id,
        email: "",
      })
    );
    dispatch(setCurrentConv({ id: conversation.id, guestName: _name, hostId: id}));
  };

  return (
    <div>
      <div>
        {error && <p>{JSON.stringify(error)}</p>}
        {loading && <p>Loading...</p>} 
        {conversationsInFirestore && (
          <ul id="conversations-list">
            {conversations.map((conversation: Conversation) => {
              // Guest name
              const guestName =
                conversation.guestId !== id
                  ? conversation.guestName
                  : conversation.hostName;

              return (
                <li
                  key={conversation.id + Math.random() + Date.now()}
                  onClick={() => loadMessages(conversation)}
                  className="conversation"
                >
                  <div id="profile">
                    <div id="image">{getInitiials(guestName)}</div>
                    <p>{guestName}</p>
                  </div>
                  <MdDelete
                    className="delete"
                    onClick={() => deleteConversation(conversation)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <BiMessageSquareAdd id="add" onClick={showPopup} />
      {!popUpState ? null : <Popup />}
    </div>
  );
}

export default Conversations;
