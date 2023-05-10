import { updateChosenUser } from "../redux/slices/chosenUserSlice";
import { collection, or, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { set } from "../redux/slices/popUpSlice";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import { UserInFirebase } from "./Models";
import { db } from "../Firebase";
import "../styles/Popup.scss";
import { current } from "@reduxjs/toolkit";

function Popup() {

  //  ************** State **************
  
  const [keyword, setKeyword] = useState("");
  const [users, setUsers] = useState<UserInFirebase[]>([]);



  // *************** Firbase Hooks ****************

  const usersRef = collection(db, "users");
  const [userList,loading, error] = useCollection(usersRef);
  const popUpState = useSelector((state: RootState) => state.popUp.popUpShown);
  const userId = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();
  const q = query(collection(db, "conversations"), or(where("guestId","==",userId), where("hostId", "==", userId)));
  const [convList,loadingConv, errorConv] = useCollection(collection(db, "conversations", ));



  // *************** Effects ****************

  useEffect(() => {
    let tmp: any = [];
    userList?.docs.forEach((doc) => {
      const data: any = {
        name: doc.data().name,
        email: doc.data().email,
        id: doc.data().uid,
      };
      if (data.id !== userId)
          tmp.push(data);
      }); 
    setUsers(tmp);
  }, [userList, keyword]);



  //  ************** Functions **************

  const createConversations = (user: UserInFirebase) => {
    let found = false;
    let id = "";
    users.forEach((currUser) => {
      if (currUser.name === user.name ){
        found = true;
        id = currUser.id;
      }
    });
    if (found){
      dispatch(updateChosenUser({
        name: user.name,
        id: user.id,
        email: user.email
      }));
      dispatch(set(false));
    }
  };

  

  //  ************** Rendering **************

  return (
    <div id="modal">
        <AiOutlineCloseCircle id="close-button" onClick={() => dispatch(set(false))}/>
        <div id="container">
        <h1>Choose a person to chat with.</h1>
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
                  className="user"
                >
                  <p>{user.name}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Popup;
