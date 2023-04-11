import app from "../Firebase";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

function UserList() {

    const [users, setUsers] = useState([]);

    const getData = () => {
        const auth = getAuth(app);
        const db = getFirestore();
        const usersRef: any = collection(db, "users");
        getDocs(usersRef).then((snapshot) => {
            let usersInFirebase: any = [];
            snapshot.docs.forEach((doc: {}) => {
                usersInFirebase.push({ ...doc.data(), id: doc.id });
            });
            setUsers(usersInFirebase);
        })
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <h1>Firebase users:</h1>
           <ul>
             {
                users.map((user: {name: string, number: number, id: number}) => {
                    return <li key={user.id}>{user.name}<br></br>{user.number}</li>
                })
            }
           </ul>
        </div>
    )
}

export default UserList;