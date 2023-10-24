import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { BsFillChatDotsFill } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";

function Menu({
  userPseudo,
  logOut,
}: {
  userPseudo: string;
  logOut: () => void;
}) {
  return (
    <div id="menu-section">
      <div id="menus">
        <AiFillHome className="actions" />
        <BsFillChatDotsFill className="actions" />
        <AiFillSetting className="actions" />
      </div>
      <div id="others">
        <p>{userPseudo}</p>
        <BiUser id="image-profile" />
        <RiShutDownLine id="shutdown" onClick={logOut} />
      </div>
    </div>
  );
}

export default Menu;
