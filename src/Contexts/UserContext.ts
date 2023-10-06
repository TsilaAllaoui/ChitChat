import { User, UserCredential } from "firebase/auth";
import { createContext } from "react";

export interface IUserCredentials {
  user: User | null;
  setUser: (u: User) => void;
}

export const UserContext = createContext<IUserCredentials>({
  user: null,
  setUser: (_u: User) => {},
});
