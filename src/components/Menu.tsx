import { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { AiFillSetting } from "react-icons/ai";
import { BiCommentAdd, BiUser } from "react-icons/bi";
import { RiShutDownLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import "../Styles/Menu.scss";
import UsersList from "./UsersList";

function Menu({
  userPseudo,
  logOut,
  conversationsAreLoading,
}: {
  userPseudo: string;
  logOut: () => void;
  conversationsAreLoading: boolean;
}) {
  /****************** States *******************/

  const [showUsersList, setShowUsersList] = useState(false);

  /****************** Contexts *****************/

  const { userConversations } = useContext(UserConversationsContext);

  /****************** Effects *******************/

  /****************** Functions *******************/

  return (
    <div id="menu-section">
      <div id="menus">
        <BiCommentAdd
          data-tooltip-id="new-conversation"
          data-tooltip-content="New Conversation"
          className="actions"
          onClick={() => {
            if (!conversationsAreLoading) setShowUsersList(true);
          }}
        />
        <AiFillSetting
          data-tooltip-id="settings"
          data-tooltip-content="Settings"
          className="actions"
        />
      </div>
      <div id="others">
        <p>{userPseudo}</p>
        <BiUser
          data-tooltip-id="user"
          data-tooltip-content="User Account"
          id="image-profile"
        />
        <RiShutDownLine
          data-tooltip-id="logout"
          data-tooltip-content="Log Out"
          id="shutdown"
          onClick={logOut}
        />
      </div>
      <Tooltip id="new-conversation" />
      <Tooltip id="settings" />
      <Tooltip id="user" />
      <Tooltip id="logout" />
      {showUsersList && !conversationsAreLoading
        ? createPortal(
            <UsersList close={() => setShowUsersList(false)} />,
            document.getElementById("portal") as HTMLElement
          )
        : null}
    </div>
  );
}

export default Menu;
