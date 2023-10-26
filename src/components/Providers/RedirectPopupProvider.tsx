import { useState } from "react";
import { RedirectPopupContext } from "../../Contexts/RedirectPopupContext";

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
