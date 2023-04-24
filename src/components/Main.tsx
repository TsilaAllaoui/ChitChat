import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { BsFillChatDotsFill } from "react-icons/bs";
import { update } from "../redux/slices/userSlice";
import { AiFillSetting, AiFillHome } from "react-icons/ai";
import { RiShutDownLine } from "react-icons/ri";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Receiver, Sender } from "./Models";
import { RootState } from "../redux/store";
import { FaSearch } from "react-icons/fa";
import { auth } from "../Firebase";
import Messages from "./Messages";
import "../styles/Main.scss";
import "./Modules";
import { getInitiials } from "./Modules";
import { IoMdCall, IoMdAttach } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import messagesSvg from "../assets/messages.svg";

function Main() {
  // ************  States   ************

  // State for showing or hiding conversations list
  const [show, setShow] = useState(false);

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
            <div>{user.initials}</div>
          </div>
          <RiShutDownLine id="shutdown" />
        </div>
      </div>
      <div id="convsersations-section">
        <div id="headers">
          <p>Chats</p>
          <FaSearch id="search" />
        </div>
        <Conversations />
      </div>
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
                <MdDelete id="delete" />
              </div>
            </div>
            <div id="messages-list">
              {currentConv.id === "" ? null : <Messages />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
