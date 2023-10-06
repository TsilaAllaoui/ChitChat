import { createContext } from "react";

export interface IIsLogin {
  isLogin: boolean;
  setIsLogin: (b: boolean) => void;
}

export const IsLoginContext = createContext<IIsLogin>({
  isLogin: false,
  setIsLogin: (_b: boolean) => {},
});
