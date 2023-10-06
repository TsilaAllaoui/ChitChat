import { UserCredential } from "firebase/auth";
import { createContext } from "react";

export interface IUserCredentials {
  user: UserCredential | null;
  setUser: (u: UserCredential) => void;
}

export const UserContext = createContext<IUserCredentials>({
  user: null,
  setUser: (_u: UserCredential) => {},
});
