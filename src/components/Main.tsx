import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import "../styles/Main.scss";

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

  return (
    <div className="root">
      <div id="app-name">ChitChat</div>
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
            <Messages receiver={receiver} sender={sender} convId={convId} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Main;
