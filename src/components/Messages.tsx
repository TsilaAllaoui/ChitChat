import { getAuth } from "firebase/auth";
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, query, Timestamp, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import app from "../Firebase";

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
    };

    useEffect(() => {
        getMessages();
    }, []);

    return (
        <div>
            <ul>
                {
                    messages.map((message: Message) => {
                        return <li key={message.id}>{message.message}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default Messages;