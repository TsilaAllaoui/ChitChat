import { useContext, useState } from "react";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import "../Styles/Profile.scss";
import Menu from "./Menu";
import Popup from "./Popup";
import { BiEditAlt, BiUser } from "react-icons/bi";
import EditDialog from "./EditDialog";
import { updateProfile } from "firebase/auth";
import { ShowProfileContext } from "../Contexts/ShowProfileContext";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";

const Profile = ({ condition }: { condition: boolean }) => {
  /******************* States **********************/
  const { userPseudo } = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [label, setLabel] = useState("");

  /******************* Contexts **********************/
  const user = useContext(UserContext).user;
  const { showProfile, setShowProfile } = useContext(ShowProfileContext);
  const { userConversationsLoading, currentConversation } = useContext(
    UserConversationsContext
  );

  /******************* Functions **********************/
  const updateDisplayName = (newName: string) => {
    if (!user) return;
    updateProfile(user!, {
      displayName: newName,
    })
      .then(() => {
        setLabel("");
        setShowEditForm(false);
        setShowPopup(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      id="user-infos-container"
      style={{ transform: `translateX(${showProfile ? "0" : "100%"})` }}
    >
      <RiArrowLeftSFill
        style={{
          transform: `translateX(${showProfile ? "-42%" : "-60%"}) scaleX(${
            !showProfile ? "1" : "-1"
          })`,
        }}
        id="arrow"
        onClick={() => setShowProfile(!showProfile)}
      />

      <div id="user-infos">
        <div id="profile-picture">
          {user && !user?.photoURL ? <BiUser /> : null}
          <BiEditAlt onClick={() => setLabel("Name")} />
        </div>
        <ul>
          <li>
            <p>{user && user!.displayName ? user!.displayName : "No name"}</p>
            <BiEditAlt onClick={() => setLabel("Name")} />
          </li>
          <li>
            <p>{user!.email}</p>
          </li>
        </ul>
      </div>
      <EditDialog
        label={label}
        condition={label != ""}
        hide={() => setLabel("")}
        action={updateDisplayName}
      />
    </div>
  );
};

export default Profile;
