import { getAuth } from "firebase/auth";
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import app from "../Firebase";
import "../styles/Messages.scss";
import MessageEntry from "./MessageEntry";
import { FiSend } from "react-icons/fi";
import { BsFillEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import { IoIosAttach } from "react-icons/io";
import { AiOutlineFileGif } from "react-icons/ai";

function Messages({senderName, senderId}:{senderName: string, senderId: string}){

    // Type for a message object
    type Message = { message: string , id: string};//, sentTime: Timestamp, id: string }

    // Messages
    const [messages, setMessages] = useState<Message[]>([]);

    // Getting messages from firebase

    const getMessages = async () => {
        // Authentification
        const auth = getAuth(app);
        const db = getFirestore();

        const messagesRef = collection(db, "conversations", senderId, "mess");

        onSnapshot(messagesRef, (snapshot) => {
            let messagesInfirebase: Message[] = [];
            snapshot.forEach((doc: any) => {
                messagesInfirebase.push({...doc.data(), id: doc.id});
            });
            setMessages(messagesInfirebase);
        });
        console.log(messages);
    };

    useEffect(() => {
        getMessages();
    }, []);

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
            <div id="main-input">
                <input type="text" />
                <BsFillSendFill id="send-button"/>
            </div>
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