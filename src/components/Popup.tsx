import { useEffect, useState } from "react";
import { ID, User, UserInFirebase } from "./Models";
import "../styles/Popup.scss";
import { collection, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { set } from "../redux/slices/popUpSlice";
import { updateChosenUser } from "../redux/slices/chosenUserSlice";

function Popup() {

  const popUpState = useSelector((state: RootState) => state.popUp.popUpShown);
  const userId = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();

  //  ************** State **************
  
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<UserInFirebase[]>([]);

  // *************** Firbase Hooks ****************

  const usersRef = collection(db, "users");
  const [userList,loading, error] = useCollection(usersRef);


  // *************** Effects ****************

  useEffect(() => {
    let tmp: any = [];
    userList?.docs.forEach((doc) => {
      if (doc.data().uid !== userId)
        tmp.push({...doc.data(), id: doc.data().uid});
    });
    setUsers(tmp);
  }, [userList]);

  //  ************** Functions **************

  const createConversations = (user: UserInFirebase) => {
    dispatch(updateChosenUser(user));
    dispatch(set(false));
  };

  //  ************** Rendering **************

  return (
    <div>
      <div id="modal">
        <button onClick={() => dispatch(set(false))}>Close</button>
        <label>Name</label>
        <input
          type="text"
          id="search-input"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button>Search</button>
        <div id="user-list">
          {error && <p>{JSON.stringify(error)}</p>}
          {loading && <p>Loading users...</p>}
          {users &&
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
      </div>
    </div>
  );
}

export default Popup;
