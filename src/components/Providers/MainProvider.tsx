import IsLoginProvider from "./IsLoginProvider";
import RedirectPopupProvider from "./RedirectPopupProvider";
import UserProvider from "./UserProvider";

const MainProvider = ({ children }: { children: any }) => {
  return (
    <UserProvider>
      <RedirectPopupProvider>
        <IsLoginProvider>{children}</IsLoginProvider>
      </RedirectPopupProvider>
    </UserProvider>
  );
};

export default MainProvider;
