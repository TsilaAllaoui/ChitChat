import { addDoc, collection, doc, Firestore, getFirestore, onSnapshot, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";
import { BsFillEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, SetStateAction } from "react";
import { AiOutlineFileGif } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IoIosAttach } from "react-icons/io";
import MessageEntry from "./MessageEntry";
import { Message } from "./Models";
import "../styles/Messages.scss";
import { auth } from "../Firebase";

function Messages({ convId, hostId, guestId }: { convId: string, hostId: string, guestId: string }) {

    // ************  States   ************

    // State for the messages
    const [messages, setMessages] = useState<Message[]>([]);

    // State for user id
    const [userId, setUserId] = useState("");

    

    // ************  Effects   ************  

    // For getting messages when the conversation change
    useEffect(() => {
        
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                getMessages();
            } else {
                const navigate = useNavigate();
                navigate("/login");
            }
        });
    }, [userId, hostId, guestId, convId]);



    // ************  Functions   ************

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
        });
    };

    // For adding new message to firebase
    const sendToFirebase = (e: any) => {
        e.preventDefault();

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


    
    // ************  Rendering   ************

    return (
        <div id="root-message">
            <div id="messages-list">
                <ul>
                    {
                        messages.map((message: Message) => {
                            return (
                                <MessageEntry key={message.id + Date.now()} content={message.message}
                                    senderId={message.senderId}
                                    receiverId={message.receiverId}
                                    hostId={hostId}
                                />
                            )
                        })
                    }
                </ul>
            </div>
            {
                messages.length > 0 ? (<div id="inputs">
                <form id="main-input" onSubmit={(e) => sendToFirebase(e)}>
                    <input type="text" name="texts" id="text-input" />
                    <button type="submit">Send</button>
                </form>
                <div id="buttons">
                    <BsFillEmojiSmileFill id="emoji-button" />
                    <IoIosAttach id="attachment-button" />
                    <AiOutlineFileGif id="gif-button" />
                </div>
            </div>) 
            : null
            }
        </div>
    )
}

export default Messages;