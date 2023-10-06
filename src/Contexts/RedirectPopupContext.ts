import { createContext } from "react";

export interface IRedirectPopup {
  redirect: boolean;
  setRedirect: (b: boolean) => void;
}

export const RedirectPopupContext = createContext<IRedirectPopup>({
  redirect: false,
  setRedirect: (_b: boolean) => {},
});
