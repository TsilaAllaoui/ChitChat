import { updateProfile } from "firebase/auth";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { useContext, useRef, useState } from "react";
import { BiEditAlt, BiUser } from "react-icons/bi";
import { RiArrowLeftSFill } from "react-icons/ri";
import { ShowProfileContext } from "../Contexts/ShowProfileContext";
import { UserContext } from "../Contexts/UserContext";
import { UserConversationsContext } from "../Contexts/UserConversationsContext";
import { db } from "../Firebase";
import "../styles/Profile.scss";
import EditDialog from "./EditDialog";

const Profile = ({ condition }: { condition: boolean }) => {
  /******************* States **********************/
  const { userPseudo, setUserPseudo, userPicture, setUserPicture } =
    useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [label, setLabel] = useState("");
  const [profilePictureURL, setProfilePictureURL] = useState("");

  /******************* Contexts **********************/

  const fileInputRef = useRef<HTMLInputElement>(null);

  /******************* Contexts **********************/
  const { user, setUser } = useContext(UserContext);
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
        getDocs(query(collection(db, "users"))).then((docs) => {
          docs.forEach((d) => {
            if (d.data().uid == user!.uid) {
              setUserPseudo(newName);
              updateDoc(doc(db, "users", d.id), {
                name: newName,
              });
            }
          });
        });
        setLabel("");
        setShowEditForm(false);
        setShowPopup(true);
      })
      .catch((err) => console.log(err));
  };

  const getProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files![0];
    file.arrayBuffer().then((arr) => {
      const bytes = new Uint8Array(arr);
      let str = "";
      for (let byte of bytes) {
        str += String.fromCharCode(byte);
      }
      str = `data:image/png;base64,${btoa(str)}`;
      console.log(str);
      setUserPicture(str);
      getDocs(query(collection(db, "users"))).then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().uid == user!.uid) {
            updateDoc(doc.ref, {
              picture: str,
            }).catch((err) => console.log(err));
          }
        });
      });
    });
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
        <div
          id="profile-picture"
          style={{ backgroundImage: `url(${userPicture})` }}
        >
          {userPicture == "" || userPicture == undefined ? <BiUser /> : null}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={getProfilePicture}
          />
          <BiEditAlt onClick={() => fileInputRef.current?.click()} />
        </div>
        <ul>
          <li>
            <p>
              {user && user!.displayName
                ? user!.displayName
                : user?.email!.slice(0, user?.email?.indexOf("@"))!}
            </p>
            <BiEditAlt onClick={() => setLabel("Name")} />
          </li>
          <li>
            <p>{user?.email}</p>
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
