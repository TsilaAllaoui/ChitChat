import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { BiCommentAdd, BiEditAlt, BiUser } from "react-icons/bi";
import { RiShutDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { UserContext } from "../Contexts/UserContext";
import "../Styles/Menu.scss";
import { ShowProfileContext } from "../Contexts/ShowProfileContext";
import UsersList from "./UsersList";

function Menu({
  logOut,
  conversationsAreLoading,
}: {
  logOut: () => void;
  conversationsAreLoading: boolean;
}) {
  /****************** States *******************/

  const [showUsersList, setShowUsersList] = useState(false);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  /****************** Contexts *****************/

  const { user, userPseudo, userPicture } = useContext(UserContext);
  const { setShowProfile } = useContext(ShowProfileContext);

  // /****************** Effects *******************/

  // useEffect(() => {
  //   setUserName(user?.displayName ? user.displayName : userPseudo);
  // }, [user]);

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
        <AiFillHome
          data-tooltip-id="home"
          data-tooltip-content="Home"
          className="actions"
          onClick={() => navigate("/home")}
        />
      </div>
      <div id="others">
        <p>{user?.displayName ? user.displayName : userPseudo}</p>
        <div
          id="picture"
          onClick={() => setShowProfile(true)}
          style={{
            backgroundImage:
              userPicture != "" ? `url(${userPicture})` : "unset",
          }}
        >
          {userPicture == "" || userPicture == undefined ? (
            <BiUser
              data-tooltip-id="user"
              data-tooltip-content="User Account"
              id="image-profile"
            />
          ) : null}
        </div>
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
