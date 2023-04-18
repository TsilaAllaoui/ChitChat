import Conversations from "./Conversations";
import { useState } from "react";
import "../styles/Main.scss";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Messages from "./Messages";

// Sender and Receiver types
type Receiver = {
    name: string,
    id: string
  };
  type Sender = Receiver;

function Main(){

    const [show, setShow] = useState(false);
    const [_receiver, setReceiver] = useState<Receiver>({name: "", id: ""})
    const [_sender, setSender] = useState<Sender>({name: "", id: ""})

    const toggleConvs = () => {
        setShow(!show);
        let convs = document.getElementById("conversations")!;
        if (show){
            convs.style.marginLeft = "0";
        }
        else{
            convs.style.marginLeft = "-29%";
        }
        console.log(show);
    };

    let receiver: Receiver = {
        name: "Tsila",
        id: "cKRWwlRPOfPaWdtv58SB"
    };

    let sender: Sender = {
        name: "Ariane",
        id: "NeLZhBOa04SkiEVcAEPf"
    };

    return (
        <div className="root">
            <div id="app-name">ChiChat</div>
            <div id="conversations">
                <button id="toggle-button" onClick={toggleConvs}>
                {show ? <SlArrowRight/> : <SlArrowLeft/> }
                </button>
                <Conversations/> 
            </div>
            <Messages receiver={receiver} sender={sender}/>
        </div>
    )
}

export default Main;