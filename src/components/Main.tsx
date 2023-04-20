import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Receiver, Sender } from "./Models";
import Messages from "./Messages";
import "../styles/Main.scss";
import Popup from "./Popup";
import { auth, db } from "../Firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";



function Main() {

  // ************  States   ************


  // State for showing or hiding conversations list
  const [show, setShow] = useState(false);

  // States for setting receiver and sender
  const [receiver, setReceiver] = useState<Receiver>({ name: "", id: "" });
  const [sender, setSender] = useState<Sender>({ name: "", id: "" });

  // State for current selected conversation
  const [convId, setConvId] = useState("");

  // State for user Id and the guest Id
  const [userId, setUserId] = useState("");

  // State for guest Id
  const [guestId, setGuestId] = useState("");

  const [userName, setUserName] = useState("");



  // ************  Effects   ************

  // For getting user infos on authentification
  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserId(user.uid);
            
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("uid", "!=", userId));
            onSnapshot(q, (snapshot) => {
              snapshot.forEach((doc: any) => {
                  setUserName(doc.data().name);
                  return;
              });
            });
          } 
      });
    }, []);



  // ************  Functions   ************


  // Toggling conversations list state
  const toggleConvs = () => {
    
    setShow(!show);
    let convs = document.getElementById("row")!;
    if (show) {
      convs.style.marginLeft = "0";
    } else {
      convs.style.marginLeft = "-29.5%";
    }
  };

  // To log out
  const navigate = useNavigate();
  const logOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
        alert("You logged out...");
        navigate("/login");
    })
    .catch(() => {
        alert("Can't log out. Contact admin...");
    });
  };



  // ************  Rendering   ************

  return (
    <div className="root">
      <div id="app-name">
        <p>ChitChat</p>
        <div id="logout-button">
            <button onClick={logOut}>LogOut</button>
        </div>
      </div>
      <div id="row">
        <div id="conversations">
          <button id="toggle-button" onClick={toggleConvs}>
            {show ? <SlArrowRight /> : <SlArrowLeft />}
          </button>
          <Conversations
            setSender={setSender}
            setReceiver={setReceiver}
            setConvId={setConvId}
            hostId={userId}
            hostName={userName}
          />
        </div>
        <div className="messages">
          {convId !== "" ? (
            <Messages convId={convId} hostId={userId} guestId={guestId}/>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Main;
