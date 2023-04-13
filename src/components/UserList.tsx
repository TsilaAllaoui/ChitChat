import app from "../Firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, onSnapshot, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";

function UserList({ userId, name }: { userId: string, name: string }) {

    // Type for a message object
    type Message = { owner: string, creationTime: Timestamp, message: string, id: string }

    // Hook for the convresations
    const [convs, setConvs] = useState<Message[]>([{ owner: "", creationTime: Timestamp.now(), message: "", id: "" }]);

    // To get data from firebase
    const getData = () => {

        // Authentification and getting db
        const auth = getAuth(app);
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

                console.log(convs);
            });
        })
    };

    // Get data at page load
    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1>Firebase conversations:</h1>
            <ul>
                {
                    convs.map((message: Message) => {
                        return <li key={message.id}>{message.message}<br></br>{message.creationTime.toDate().toString()}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default UserList;