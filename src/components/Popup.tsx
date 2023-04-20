import { useEffect, useState } from "react";
import { ID, User, UserInFb } from "./Models";
import "../styles/Popup.scss";
import { collection, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../Firebase";

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
  const [userList, setUserList] = useState<ID[]>([]);
  
  
  //  ************** State **************

    // Getting users in firebase that are not the current host
    useEffect(() => {

        let users: {name:string, id: string}[] = [];

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "!=", hostId));
      onSnapshot(q, (snapshot) => {
        snapshot.forEach((doc: any) => {
            const data: UserInFb = {...doc.data()};
            users.push({name: data.name, id: data.uid});
        });
        setUserList(users);
      });
      
    }, [])
    


  //  ************** Functions **************

  const createConversations = (user: ID) => {
    setNewUser(user);
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
          {userList.length > 0 &&
            userList.map((user) => {
              return (
                <div
                  key={user.id + Date.now()}
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
