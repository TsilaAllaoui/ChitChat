import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import "../styles/Main.scss";
import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { useNavigate } from "react-router";

// Sender and Receiver types
type Receiver = {
  name: string;
  id: string;
};
type Sender = Receiver;

function Main() {
  // State for showing or hiding conversations list
  const [show, setShow] = useState(false);

  // States for setting receiver and sender
  const [receiver, setReceiver] = useState<Receiver>({ name: "", id: "" });
  const [sender, setSender] = useState<Sender>({ name: "", id: "" });

  // State for current selected conversation
  const [convId, setConvId] = useState("");

  // State for user Id
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserId(user.uid);
        } else {

        }
    });
}, [userId]);

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
          />
        </div>
        <div className="messages">
          {convId !== "" ? (
            <Messages receiver={receiver} sender={sender} convId={convId} hostId={userId}/>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Main;
