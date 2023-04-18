import { getFirestore, collection, onSnapshot, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../Firebase";

function UserList({ userId, name }: { userId: string, name: string }) {

    // Authentification and getting datas
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user)
            console.log(user);
        else console.log("Error getting user datas...");
    });

    // Type for a conversation object
    type Conversation = { owner: string, senderId: string, senderName: string, id: string }

    // Hook for the convresations
    const [convs, setConvs] = useState<Conversation[]>([{ owner: "", senderId: "", senderName: "", id: "" }]);

    // To get data from firebase
    const getData = () => {

        // Getting db
        const db = getFirestore();
        const convsRef: any = collection(db, "conversations");

        // Query for conversations only with the user id as the owner
        const q = query(convsRef, where("owner", "==", userId));

        // Getting only conversations for the current user
        onSnapshot(q, (snapshot) => {

            // setConvs([{ owner: "", timeStamp: Timestamp.now(), message: "", id:"" }]);
            let convsInFirebase: any = [];
            snapshot.forEach((doc: any) => {
                convsInFirebase.push({ ...doc.data(), id: doc.id })

                // Setting conversations
                setConvs(convsInFirebase);
            });
        })
    };

    // Get data at page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1>{name} conversations:</h1>
            <ul>
                {
                    convs.map((conversation: Conversation) => {
                        return <li key={conversation.id}>{conversation.senderName}<br></br>{conversation.id}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default UserList;