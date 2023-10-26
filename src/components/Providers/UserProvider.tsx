import { User } from "firebase/auth";
import { useState } from "react";
import { UserContext } from "../../Contexts/UserContext";

const UserProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
