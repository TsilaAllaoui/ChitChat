import { Children, useState } from "react";
import { IsLoginContext } from "../../Contexts/IsLoginContext";

const IsLoginProvider = ({ children }: { children: any }) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <IsLoginContext.Provider
      value={{ isLogin: isLogin, setIsLogin: setIsLogin }}
    >
      {children}
    </IsLoginContext.Provider>
  );
};

export default IsLoginProvider;
