import { User } from "firebase/auth";
import { useState } from "react";
import { UserContext } from "../../Contexts/UserContext";

const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userPseudo, setUserPseudo] = useState("");
  const [userPicture, setUserPicture] = useState("");

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userPseudo,
        setUserPseudo,
        userPicture,
        setUserPicture,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
