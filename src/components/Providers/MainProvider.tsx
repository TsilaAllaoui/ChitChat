import IsLoginProvider from "./IsLoginProvider";
import RedirectPopupProvider from "./RedirectPopupProvider";
import UserProvider from "./UserProvider";
import UserConversationsProvider from "./userConversationsProvider";

const MainProvider = ({ children }: { children: any }) => {
  return (
    <UserProvider>
      <RedirectPopupProvider>
        <IsLoginProvider>
          <UserConversationsProvider>{children}</UserConversationsProvider>
        </IsLoginProvider>
      </RedirectPopupProvider>
    </UserProvider>
  );
};

export default MainProvider;
