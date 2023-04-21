import { addDoc, collection, doc, Firestore, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from "firebase/firestore";
import { BsFillEmojiSmileFill, BsFillSendFill } from "react-icons/bs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect, SetStateAction } from "react";
import { AiOutlineFileGif } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IoIosAttach } from "react-icons/io";
import MessageEntry from "./MessageEntry";
import { Message } from "./Models";
import "../styles/Messages.scss";
import { auth, db } from "../Firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Messages() {

    // State for the messages
    const [messages, setMessages] = useState<Message[]>([]);

    const currentConvId = useSelector((state: RootState) => state.currentConvId.id);
    const id = useSelector((state: RootState) => state.user.id);
    const guestId = useSelector((state: RootState) => state.chosenUser.chosenUser.id);

    // ************  Firebase Hooks   ************
    const messRefs = collection(db, "conversations", currentConvId, "mess");
    const q = query(messRefs, orderBy("sentTime"));
    const [messageList, loading, error] = useCollection(q);



    // ************  Effects   ************  

    useEffect(() => {
        console.log(currentConvId)
        let tmp: any[] = [];
        messageList?.docs.forEach((doc) => {
            tmp.push({ ...doc.data(), id: doc.data().id });
        });
        setMessages(tmp);
    }, [currentConvId]);

    // useEffect(() => {
    //     if (messageList?.docs.length === 0)
    //     {
    //         let tmp: any[] = [];
    //         messageList?.docs.forEach((doc) => {
    //             tmp.push({ ...doc.data(), id: doc.data().id });
    //         });
    //         setMessages(tmp);                                                                                   
    //     }
    //     else
    //     {
    //         let tmp: any[] = messages;
    //         tmp.push(messageList?.docs[messageList?.docs.length - 1])
    //         setMessages(tmp);                                                                                   
    //     }
    // }, [messageList]);

    useEffect(() => {
        console.log("Modified array")
        let tmp: any[] = [];
        messageList?.docs.forEach((doc) => {
            tmp.push({ ...doc.data(), id: doc.data().id });
        });
        setMessages(tmp);
    }, [messageList]);

    // ************ Functions **************

    const sendToFirebase = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(guestId)

        const messRef = collection(db, "conversations", currentConvId, "mess");
        addDoc(messRef,
            {
                message: (e.currentTarget.elements[0] as HTMLInputElement).value,
                senderId: id,
                receiverId: guestId,
                hostId: id,
                sentTime: serverTimestamp()
            })
    };

    /*// ************  States   ************
 
    // State for the messages
    const [messages, setMessages] = useState<Message[]>([]);
 
    // State for user id
    const [userId, setUserId] = useState("");
 
    // ************  Firebase Hooks   ************
    const messRefs = collection(db, "conversations", convId, "mess");
    const q = query(messRefs, );
    const [messageList, loading, error] = useCollection(q);
 
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
    }, [userId]);
 
    useEffect(() => {
        getMessages();
    }, [messageList]);
 
    // ************  Functions   ************
 
    // Getting messages from firebase
    const getMessages = () => {
 
        let list: any[] = [];
        messageList?.forEach((doc) => {
            list.push({...doc.data(), id: doc.data().id});
        });
        setMessages(list);
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
*/


    // ************  Rendering   ************

    return (
        <div id="root-message">
            <div id="messages-list">
                <ul>
                    {error && <p>{JSON.stringify(error)}</p>}
                    {loading && <p>Loading messages...</p>}
                    {
                        messages && messages.map((message: Message) => {
                            return (
                                <MessageEntry key={message.id + message.message} 
                                    content={message.message}
                                    senderId={message.senderId}
                                    receiverId={message.receiverId}
                                    hostId={id}
                                />
                            )
                        })
                    }
                </ul>
            </div>
            <div>
                {
                    messages.length === 0 ? null :
                        <div id="inputs">
                            <form id="main-input" onSubmit={(e) => sendToFirebase(e)}>
                                <input type="text" name="texts" id="text-input" />
                                <button type="submit">Send</button>
                            </form>
                            <div id="buttons">
                                <BsFillEmojiSmileFill id="emoji-button" />
                                <IoIosAttach id="attachment-button" />
                                <AiOutlineFileGif id="gif-button" />
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default Messages;