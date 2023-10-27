import IsLoginProvider from "./IsLoginProvider";
import RedirectPopupProvider from "./RedirectPopupProvider";
import ShowProfileProvider from "./ShowProfileProvider";
import UserProvider from "./UserProvider";
import UserConversationsProvider from "./userConversationsProvider";

const MainProvider = ({ children }: { children: any }) => {
  return (
    <UserProvider>
      <RedirectPopupProvider>
        <IsLoginProvider>
          <UserConversationsProvider>
            <ShowProfileProvider>{children}</ShowProfileProvider>
          </UserConversationsProvider>
        </IsLoginProvider>
      </RedirectPopupProvider>
    </UserProvider>
  );
};

export default MainProvider;
