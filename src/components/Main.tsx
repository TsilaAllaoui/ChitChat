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

function Main() {

    const [show, setShow] = useState(false);
    const [receiver, setReceiver] = useState<Receiver>({
        name: "Tsila",
        id: "cKRWwlRPOfPaWdtv58SB"
    })
    const [sender, setSender] = useState<Sender>({
        name: "Ariane",
        id: "NeLZhBOa04SkiEVcAEPf"
    })


    const toggleConvs = () => {
        setShow(!show);
        let convs = document.getElementById("row")!;
        if (show) {
            convs.style.marginLeft = "0";
        }
        else {
            convs.style.marginLeft = "-29%";
        }
        console.log(show);
    };

    return (
        <div className="root">
            <div>{receiver.name}</div>
            <div>{sender.name}</div>
            <div id="app-name">ChitChat</div>
            <div id="row">
                <div id="conversations">
                    <button id="toggle-button" onClick={toggleConvs}>
                        {show ? <SlArrowRight /> : <SlArrowLeft />}
                    </button>
                    <Conversations setSender={setSender} setReceiver={setReceiver} />
                </div>
                <div className="messages">
                    <Messages receiver={receiver} sender={sender} />
                </div>
            </div>
        </div>
    )
}

export default Main;