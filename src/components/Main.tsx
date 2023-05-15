import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { setCurrentConv } from "../redux/slices/currentConversationSlice";
import { onAuthStateChanged, signOut } from "@firebase/auth";
import { AiFillSetting, AiFillHome } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { IoMdCall, IoMdAttach } from "react-icons/io";
import { BsFillChatDotsFill } from "react-icons/bs";
import { update } from "../redux/slices/userSlice";
import messagesSvg from "../assets/messages.svg";
import { RiShutDownLine } from "react-icons/ri";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { RootState } from "../redux/store";
import { MdDelete } from "react-icons/md";
import { getInitiials } from "./Model/Modules";
import { auth, db } from "../Firebase";
import Messages from "./Messages";
import "../styles/Main.scss";
import "./Model/Modules";


function Main() {
  
  // ************  States   ************

  // State for showing or hiding conversations list
  const [show, setShow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // ************ Redux Selector and Dispatches ************

  const user = useSelector((state: RootState) => state.user);
  const currentConv = useSelector((state: RootState) => state.currentConvId);
  const dispatch = useDispatch();

  // ************  Effects   ************

  // For getting user infos on authentification
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const initials = getInitiials(user.displayName!);

        dispatch(
          update({
            name: user.displayName!, //"Tsila",
            id: user.uid, //"123",
            initials: initials,
          })
        );
      }
    });
  }, []);


  // ************* Functions **************

  // To log out
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth).then(() => {
      alert("Logged out... Redirecting to login page...");
      navigate("/login");
    });
  };

  const deleteConversation = (id: string) => {
    console.log("delete");
    const q = query(collection(db, "conversations"), where("id", "==", currentConv.id));
    getDocs(q).then((snap) => {
      snap.docs.forEach((doc) => {
        const data = { ...doc.data(), id: doc.data().id };
        if (data.id === id) {
          deleteDoc(doc.ref).then(() => {
            if (snap.docs.length === 0) {
              dispatch(setCurrentConv({ id: "", guestName: "", hostId: "" }));
            }
          });
        }
      });
    });
    setShowConfirmation(false);
  };

  // ************  Rendering   ************

  return (
    <div id="main">
      <div id="menu-section">
        <div id="menus">
          <AiFillHome className="actions" />
          <BsFillChatDotsFill className="actions" />
          <AiFillSetting className="actions" />
        </div>
        <div id="others">
          <div id="image-profile">
            <div id="initials">
              <p>{user.initials}</p>
            </div>
          </div>
          <RiShutDownLine id="shutdown" onClick={logOut}/>
        </div>
      </div>
      <div id="separator"></div>
      <div id="convsersations-section">
        <Conversations />
      </div>
      <div id="separator"></div>
      <div id="messages-section">
        {currentConv.id === "" ?
        <div id="messages-placeholder">
          <p>Click on conversation to see messages...</p>
          <div>
            <img src={messagesSvg}  />
          </div>
        </div>
        : (
          <div>
            <div id="actions">
              <div id="profile">
                <div id="image">{getInitiials(currentConv.guestName)}</div>
                <div id="name">{currentConv.guestName}</div>
              </div>
              <div id="actions-profile">
                <IoMdAttach id="attachment" />
                <IoMdCall id="call" />
                <MdDelete id="delete" onClick={() => setShowConfirmation(true)} />
              </div>
            </div>
            <div id="messages-list">
              {currentConv.id === "" ? null : <Messages />}
            </div>
          </div>
        )}
      </div>
      {
        !showConfirmation ? null :
        <div id="confirmation">
        <p>Delete conversation?</p>
        <div id="buttons">
          <button id="yes" onClick={() => {deleteConversation(currentConv.id)}}>Yes</button>
          <button id="no" onClick={() => {setShowConfirmation(false)}}>No</button>
        </div>
      </div>
      }
    </div>
  );
}

export default Main;
