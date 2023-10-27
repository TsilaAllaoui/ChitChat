import { useState } from "react";
import { ShowProfileContext } from "../../Contexts/ShowProfileContext";

const ShowProfileProvider = ({ children }: { children: any }) => {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <ShowProfileContext.Provider
      value={{
        showProfile,
        setShowProfile,
      }}
    >
      {children}
    </ShowProfileContext.Provider>
  );
};

export default ShowProfileProvider;
