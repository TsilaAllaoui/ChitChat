import { useEffect, useState } from "react";
import { IUserCredentials } from "../Contexts/UserContext";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query } from "firebase/firestore";
import { db } from "../Firebase";

export type IUser = {
  email: string;
  name: string;
  uid: string;
};

const UserList = () => {
  /**************** States ****************/

  const [users, setUsers] = useState<IUser[]>([]);

  /**************** Firebase Hooks ****************/

  const usersRef = collection(db, "users");
  const [usersList, loading, error] = useCollection(query(usersRef));

  useEffect(() => {
    let tmp: IUser[] = [];

    usersList?.forEach((doc) => {
      tmp.push({
        email: doc.data().email,
        name: doc.data().name,
        uid: doc.data().uid,
      });
    });

    setUsers(tmp);
  }, [usersList]);

  return (
    <div>
      <ul>
        {users &&
          users.map((user) => (
            <li>
              {user.name} : {user.email}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;
