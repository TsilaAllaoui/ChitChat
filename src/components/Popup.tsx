import { useEffect, useState } from "react";
import { ID, User, UserInFb } from "./Models";
import "../styles/Popup.scss";
import { collection, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useCollection } from "react-firebase-hooks/firestore";

function Popup({
  setPopupState,
  setNewUser,
  hostId
}: {
  setPopupState: (param: boolean) => void;
  setNewUser: (param: ID) => void;
  hostId: string
}) {
  //  ************** State **************
  
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<ID[]>([]);

  // *************** Firbase Hooks ****************

  const usersRef = collection(db, "users");
  const [userList,loading, error] = useCollection(usersRef);


  // *************** Effects ****************

  useEffect(() => {
    let tmp: any = [];
    userList?.docs.forEach((doc) => {
        tmp.push({...doc.data()});
    });
    console.log(userList);
    setUsers(tmp);
  }, [userList]);

  //  ************** Functions **************

  const createConversations = (user: ID) => {
    setNewUser(user);
    console.log("newUser: ", user);
    setPopupState(false);
  };

  //  ************** Rendering **************

  return (
    <div>
      <div id="modal">
        <button onClick={() => setPopupState(false)}>Close</button>
        <label>Name</label>
        <input
          type="text"
          id="search-input"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button>Search</button>
        <div id="user-list">
          {users.length > 0 &&
            users.map((user) => {
              return (
                <div
                  key={Math.random() + Date.now()}
                  onClick={() => createConversations(user)}
                >
                  {keyword === "" ? (
                    <p>{user.name}</p>
                  ) : user.name.includes(keyword) ? (
                    <p>{user.name}</p>
                  ) : null}
                </div>
              );
            })}
        </div>
        <button type="submit"></button>
      </div>
    </div>
  );
}

export default Popup;
