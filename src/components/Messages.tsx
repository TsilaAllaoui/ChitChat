import { addDoc, collection, doc, getFirestore, onSnapshot, orderBy, query, setDoc, Timestamp } from "firebase/firestore";
import { BsFillEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import { AiOutlineFileGif } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IoIosAttach } from "react-icons/io";
import MessageEntry from "./MessageEntry";
import { getAuth } from "firebase/auth";
import "../styles/Messages.scss";
import app from "../Firebase";

// Sender and Receiver types
type Receiver = {
    name: string,
    id: string
  };
  type Sender = Receiver;

function Messages({receiver, sender}: {receiver: Receiver, sender: Sender}){

    // Getting props passed from Link
    // const location = useLocation();
    // let _receiver = location.state.receiver;
    // let _sender = location.state.sender;
    let _receiver = receiver;
    let _sender = sender;

    // Type for a message object
    type Message = { message: string , receiverId: string, senderId: string, id: string };

    // Messages
    const [messages, setMessages] = useState<Message[]>([]);

    // Authentification
    const auth = getAuth(app);
    const db = getFirestore();
    const messagesRef = collection(db, "conversations", _sender.id, "mess");

    // Query to fetch by sent time
    const q = query(messagesRef, orderBy("sentTime"));
    
    // Getting messages from firebase
    const getMessages = async () => {
        onSnapshot(q, (snapshot) => {
            let messagesInfirebase: Message[] = [];
            snapshot.forEach((doc: any) => {
                messagesInfirebase.push({...doc.data(), id: doc.id});
            });
            setMessages(messagesInfirebase);
            console.log(messages);
        });
    };

    // Run once at start
    useEffect(() => {
        getMessages();
    }, []);

    // For adding new message to firebase
    const sendToFirebase = (e: any) => {
        e.preventDefault();
        console.log(e.target.elements.texts.value);
        const messRef = collection(db, "conversations", _sender.id, "mess");
        addDoc(messRef, 
            {
                message: e.target.elements.texts.value,
                senderId: _receiver.id, 
                receiverId: _sender.id, 
                sentTime: Timestamp.now()}).then(() => {
                    console.log("doc added");
                })
                .catch(() => {
                    console.log("error when adding doc");
                })
    };

    return (
        <>
        <div id="messages-list">
            <ul>
                {
                    messages.map((message: Message) => {
                        return <MessageEntry key={message.id} senderId={message.senderId} getterId={message.receiverId} content={message.message} masterId={_receiver.id}/>;
                    })
                }
            </ul>
        </div>
        <div id="inputs">
            <form id="main-input" onSubmit={(e) => sendToFirebase(e)}>
                <input type="text" name="texts" id="text-input"/>
                <button type="submit">Send</button>
            </form>
            <div id="buttons">
                <BsFillEmojiSmileFill id="emoji-button"/>
                <IoIosAttach id="attachment-button"/>
                <AiOutlineFileGif id="gif-button"/>
            </div>
        </div>
        </>
    )
}

export default Messages;