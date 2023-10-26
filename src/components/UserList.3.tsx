import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { MoonLoader } from "react-spinners";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { db } from "../Firebase";
import { IUser } from "./UsersList";

export const UserList = ({ close }: { close: () => void }) => {
  /**************** States ****************/
  const [users, setUsers] = useState<IUser[]>([]);

  /**************** Contexts ****************/
  const { userConversations, setCurrentConversation } = useContext(
    UserConversationsContext
  );
  const user = useContext(UserContext).user;

  /**************** Functions ****************/
  const isUserAlreadyInList = (user: IUser) => {
    return (
      userConversations.find((Conversation) =>
        Conversation.participants.includes(user.uid)
      ) != undefined
    );
  };

  const addNewConversation = async (userToChatTo: IUser) => {
    addDoc(collection(db, "conversations"), {
      guestId: userToChatTo.uid,
      guestName: userToChatTo.name,
      hostId: user!.uid,
      hostName:
        user!.displayName == null
          ? user!.email?.slice(0, user!.email.indexOf("@"))
          : user!.displayName,
      id: "",
      participants: [userToChatTo.uid, user!.uid],
    }).then((newDoc) => {
      updateDoc(newDoc, {
        id: newDoc.id,
      }).then(() => {
        const messagesCollection = collection(
          db,
          "conversations",
          newDoc.id,
          "mess"
        );
        addDoc(messagesCollection, {
          hostId: user!.uid,
          message: "Hello " + userToChatTo.name,
          senderId: user!.uid,
          sentTime: serverTimestamp(),
        }).then(() => {
          getDocs(query(db, "conversations"));
          setCurrentConversation({});
        });
      });
    });
  };

  /**************** Firebase Hooks ****************/
  const usersRef = collection(db, "users");
  const [usersList, loading, error] = useCollection(query(usersRef));

  useEffect(() => {
    let tmp: IUser[] = [];

    usersList?.forEach((doc) => {
      tmp.push({
        email: doc.data().email,
        name: doc.data().name,
        uid: doc.data().uid,
        picture: "",
      });
    });

    setUsers(tmp);
  }, [usersList]);

  return (
    <div id="users-list-container" onClick={close}>
      <ul id="users-list">
        <div id="header">
          <h1>All available users for discussions</h1>
          <AiOutlineCloseCircle id="icon" onClick={close} />
        </div>
        {loading ? (
          <div id="spinner">
            <MoonLoader size={35} color="white" />
          </div>
        ) : (
          users.map((user) => {
            if (isUserAlreadyInList(user)) return null;
            else
              return (
                <li onClick={() => addNewConversation(user)} key={user.uid}>
                  <div id="profile-pic">
                    {user.picture == "" ? <BiUser /> : null}
                  </div>
                  <p>
                    {user.name == ""
                      ? user.email.slice(0, user.email.indexOf("@"))
                      : user.name}
                  </p>
                </li>
              );
          })
        )}
      </ul>
    </div>
  );
};
