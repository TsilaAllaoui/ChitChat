import { addDoc, collection, doc, Firestore, getFirestore, onSnapshot, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";
import { BsFillEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import { AiOutlineFileGif } from "react-icons/ai";
import { useState, useEffect, SetStateAction } from "react";
import { IoIosAttach } from "react-icons/io";
import MessageEntry from "./MessageEntry";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "../styles/Messages.scss";
import app from "../Firebase";
import { useNavigate } from "react-router-dom";

// Sender and Receiver types
type Receiver = {
    name: string,
    id: string
};
type Sender = Receiver;

function Messages({ convId, hostId, guestId }: { convId: string , hostId: string, guestId: string}) {

    console.log("Conversation id: ",convId);

    // Type for a message object
    type Message = { message: string, receiverId: string, senderId: string, id: string };

    // Messages
    const [messages, setMessages] = useState<Message[]>([]);

    // Set up userId and trigger get messages function
    const [userId, setUserId] = useState("");
    const [wait, setWait] = useState(0);
    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                getMessages();
                console.log("user", userId, " logged in...");
            } else {
                const navigate = useNavigate();
                navigate("/login");
            }
        });
    }, [userId, hostId, guestId]);

    // Getting messages from firebase
    const getMessages = () => {

        // Authentification
        const auth = getAuth();
        const db = getFirestore();
        const messagesRef = collection(db, "conversations", convId, "mess");

        // Query to fetch by sent time
        const q = query(messagesRef, orderBy("sentTime"));

        onSnapshot(q, (snapshot) => {
            let messagesInfirebase: Message[] = [];
            snapshot.forEach((doc: any) => {
                messagesInfirebase.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messagesInfirebase);
            console.log("messages: ",messages);
        });
    };

    // For adding new message to firebase
    const sendToFirebase = (e: any) => {
        e.preventDefault();
        console.log(e.target.elements.texts.value);

        const auth = getAuth();
        const db = getFirestore();
        const messRef = collection(db, "conversations", convId, "mess");
        addDoc(messRef,
            {
                message: e.target.elements.texts.value,
                senderId: hostId,
                receiverId: guestId,
                sentTime: Timestamp.now()
            })
    };

    return (
        <div id="root-message">
            <div id="messages-list">
                <ul>
                    {
                        messages.map((message: Message) => {
                            return (
                               <MessageEntry content={message.message}
                                senderId={message.senderId}
                                receiverId={message.receiverId}
                                hostId={hostId}
                               />
                            )
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
        </div>
    )
}

export default Messages;