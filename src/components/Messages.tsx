import "../styles/Messages.scss";
import app from "../Firebase";
import MessageEntry from "./MessageEntry";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { BsFillEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import { IoIosAttach } from "react-icons/io";
import { AiOutlineFileGif } from "react-icons/ai";

function Messages({senderName, senderId}:{senderName: string, senderId: string}){

    // Type for a message object
    type Message = { message: string , id: string};//, sentTime: Timestamp, id: string }

    // Messages
    const [messages, setMessages] = useState<Message[]>([]);

    // Authentification
    const auth = getAuth(app);
    const db = getFirestore();
    const messagesRef = collection(db, "conversations", senderId, "mess");
    
    // Getting messages from firebase
    const getMessages = async () => {
        onSnapshot(messagesRef, (snapshot) => {
            let messagesInfirebase: Message[] = [];
            snapshot.forEach((doc: any) => {
                messagesInfirebase.push({...doc.data(), id: doc.id});
            });
            setMessages(messagesInfirebase);
        });
        console.log(messages);
    };

    // Run once at start
    useEffect(() => {
        getMessages();
    }, []);

    // For adding new message to firebase
    const sendToFirebase = (e: any) => {
        e.preventDefault();
        console.log(e.target.elements.texts.value);
        const messRef = collection(db, "conversations", senderId, "mess");
        addDoc(messRef, {id: messRef.id, message: e.target.elements.texts.value}).then(() => {
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
                        return <MessageEntry key={message.id} id={message.id} content={message.message}/>;
                    })
                }
            </ul>
        </div>
        <div id="inputs">
            <form id="main-input" onSubmit={(e) => sendToFirebase(e)}>
                <input type="text" name="texts" id="text-input"/>
                <BsFillSendFill id="send-button"/>
                <button type="submit">Submit</button>
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