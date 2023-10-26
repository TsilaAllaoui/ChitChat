import { addDoc, collection, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { db } from "../Firebase";
import { MoonLoader } from "react-spinners";
import { IUser } from "./UsersList";

export const UserList = ({ close }: { close: () => void }) => {
  /**************** States ****************/
  const [users, setUsers] = useState<IUser[]>([]);

  /**************** Contexts ****************/
  const { userConversations } = useContext(UserConversationsContext);

  /**************** Functions ****************/
  const isUserAlreadyInList = (user: IUser) => {
    return (
      userConversations.find((Conversation) =>
        Conversation.participants.includes(user.uid)
      ) != undefined
    );
  };

  const addNewConversation = () => {
    addDoc(collection(db, "conversations"));
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
    <div id="users-list-container">
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
                <li onClick={addNewConversation}>
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
