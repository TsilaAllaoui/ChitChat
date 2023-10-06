import { useContext, useState } from "react";
import {
  IRedirectPopup,
  RedirectPopupContext,
} from "../../Contexts/RedirectPopupContext";

const RedirectPopupProvider = ({ children }: { children: any }) => {
  const [redirect, setRedirect] = useState(false);

  return (
    <RedirectPopupContext.Provider
      value={{ redirect: redirect, setRedirect: setRedirect }}
    >
      {children}
    </RedirectPopupContext.Provider>
  );
};

export default RedirectPopupProvider;
