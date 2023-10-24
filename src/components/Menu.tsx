import { createPortal } from "react-dom";
import { AiFillSetting } from "react-icons/ai";
import { BiCommentAdd, BiUser } from "react-icons/bi";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import UserList from "./UserList";

function Menu({
  userPseudo,
  logOut,
}: {
  userPseudo: string;
  logOut: () => void;
}) {
  /****************** Functions *******************/

  const newConversation = () => {};

  return (
    <div id="menu-section">
      <div id="menus">
        <BiCommentAdd
          data-tooltip-id="new-conversation"
          data-tooltip-content="New Conversation"
          className="actions"
          onClick={newConversation}
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
      {/* {createPortal(
        <UserList />,
        document.getElementById("portal") as HTMLElement
      )} */}
    </div>
  );
}

export default Menu;
