import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { setCurrentConv } from "../redux/slices/currentConversationSlice";
import { onAuthStateChanged, signOut } from "@firebase/auth";
import { AiFillSetting, AiFillHome } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { IoMdCall, IoMdAttach } from "react-icons/io";
import { BsFillChatDotsFill } from "react-icons/bs";
import { update } from "../redux/slices/userSlice";
import messagesSvg from "../assets/messages.svg";
import { RiShutDownLine } from "react-icons/ri";
// import Conversations from "./Conversations";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { RootState } from "../redux/store";
import { MdDelete } from "react-icons/md";
import { getInitiials } from "./Model/Modules";
import { auth, db } from "../Firebase";
import Messages from "./Messages";
import "../styles/MainPage.scss";
import "./Model/Modules";
import { UserContext } from "../Contexts/UserContext";
import Popup from "./Popup";
import { BiUser } from "react-icons/bi";

export const MainPage = () => {
  // ************  States   ************
  const { user, setUser } = useContext(UserContext);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  // ************  Effects   ************

  useEffect(() => {
    const root = document.getElementById("root") as HTMLElement;
    root.style.background = "#19376d";
  }, []);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      navigate("/login");
    }
  });

  // ************* Functions **************

  // To log out
  const navigate = useNavigate();
  const logOut = () => {
    signOut(auth).then(() => {
      setRedirectToLogin(true);
      navigate("/login");
    });
  };

  return (
    <div id="main">
      {redirectToLogin ? (
        <Popup
          content="Logging out... Redirection in progess..."
          hidePopup={() => setRedirectToLogin(false)}
        />
      ) : null}
      <div id="menu-section">
        <div id="menus">
          <AiFillHome className="actions" />
          <BsFillChatDotsFill className="actions" />
          <AiFillSetting className="actions" />
        </div>
        <div id="others">
          <p>
            {user!.displayName
              ? user?.displayName![0].toUpperCase() +
                user?.displayName!.slice(1)!
              : user?.email![0].toUpperCase() +
                user?.email!.slice(1, user?.email?.indexOf("@"))!}
          </p>
          <BiUser id="image-profile" />
          <RiShutDownLine id="shutdown" onClick={logOut} />
        </div>
      </div>
      <div id="separator"></div>
      <div id="convsersations-section">{/* <Conversations /> */}</div>
      <div id="separator"></div>
      <div id="messages-section">
        {/* {currentConv.id === "" ? (
            <div id="messages-placeholder">
              <p>Click on conversation to see messages...</p>
              <div>
                <img src={messagesSvg} />
              </div>
            </div>
          ) : (
            <div>
              <div id="actions">
                <div id="profile">
                  <div id="image">{getInitiials(currentConv.guestName)}</div>
                  <div id="name">{currentConv.guestName}</div>
                </div>
                <div id="actions-profile">
                  <div>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      ref={fileChooser}
                      onChange={(e) => setSelectedFile(e.target.files![0])}
                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
                    />
                    <IoMdAttach
                      id="attachment"
                      onClick={() => fileChooser.current!.click()}
                    />
                  </div>
                  <IoMdCall id="call" />
                  <MdDelete
                    id="delete"
                    onClick={() => setShowConfirmation(true)}
                  />
                </div>
              </div>
              <div id="messages-list">
                {currentConv.id === "" ? null : <Messages />}
              </div>
            </div>
          )} */}
      </div>
      {/* {!showConfirmation ? null : (
        <div id="confirmation">
          <p>Delete conversation?</p>
          <div id="buttons">
            <button
              id="yes"
              onClick={() => {
                // deleteConversation(currentConv.id);
              }}
            >
              Yes
            </button>
            <button
              id="no"
              onClick={() => {
                setShowConfirmation(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

//   // ************  States   ************

//   // State for showing or hiding conversations list
//   const [show, setShow] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // ************ Redux Selector and Dispatches ************

//   // const user = useSelector((state: RootState) => state.user);
//   // const currentConv = useSelector((state: RootState) => state.currentConvId);
//   // const dispatch = useDispatch();

//   // ************ Ref *************

//   const fileChooser = useRef<HTMLInputElement>(null);

//   // ************  Effects   ************

//   // For getting user infos on authentification
//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         const initials = getInitiials(user.displayName!);

//         // dispatch(
//         //   update({
//         //     name: user.displayName!, //"Tsila",
//         //     id: user.uid, //"123",
//         //     initials: initials,
//         //   })
//         // );
//       }
//     });
//   }, []);

//   // When a file is selected
//   useEffect(() => {
//     console.log(selectedFile);
//     addAttachment();
//   }, [selectedFile]);

//   // ************* Functions **************

//   // To log out
//   const navigate = useNavigate();
//   const logOut = () => {
//     signOut(auth).then(() => {
//       alert("Logged out... Redirecting to login page...");
//       navigate("/login");
//     });
//   };

//   const deleteConversation = (id: string) => {
//     console.log("delete");
//     const q = query(
//       collection(db, "conversations")
//       // where("id", "==", currentConv.id)
//     );
//     getDocs(q).then((snap) => {
//       snap.docs.forEach((doc) => {
//         const data = { ...doc.data(), id: doc.data().id };
//         if (data.id === id) {
//           deleteDoc(doc.ref).then(() => {
//             if (snap.docs.length === 0) {
//               // dispatch(setCurrentConv({ id: "", guestName: "", hostId: "" }));
//             }
//           });
//         }
//       });
//     });
//     setShowConfirmation(false);
//   };

//   const addAttachment = () => {
//     const file = selectedFile;
//     console.log(file);
//     if (!file) {
//       console.log("File empty");
//       return;
//     }

//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     let base64: string | ArrayBuffer = "";
//     reader.onloadend = () => {
//       base64 = reader.result!;
//       let [height, width] = ["", ""];
//       let img = new Image();
//       img.src = base64.toString();
//       console.log(img.src);
//       img.onload = () => {
//         height = img.height.toString();
//         width = img.width.toString();
//       };
//     };
//   };

//   // ************  Rendering   ************

//   return (
//     <div id="main">
//       <div id="menu-section">
//         <div id="menus">
//           <AiFillHome className="actions" />
//           <BsFillChatDotsFill className="actions" />
//           <AiFillSetting className="actions" />
//         </div>
//         <div id="others">
//           <div id="image-profile">
//             <div id="initials">{/* <p>{user.initials}</p> */}</div>
//           </div>
//           <RiShutDownLine id="shutdown" onClick={logOut} />
//         </div>
//       </div>
//       <div id="separator"></div>
//       <div id="convsersations-section">
//         <Conversations />
//       </div>
//       <div id="separator"></div>
//       <div id="messages-section">
//         {/* {currentConv.id === "" ? (
//           <div id="messages-placeholder">
//             <p>Click on conversation to see messages...</p>
//             <div>
//               <img src={messagesSvg} />
//             </div>
//           </div>
//         ) : (
//           <div>
//             <div id="actions">
//               <div id="profile">
//                 <div id="image">{getInitiials(currentConv.guestName)}</div>
//                 <div id="name">{currentConv.guestName}</div>
//               </div>
//               <div id="actions-profile">
//                 <div>
//                   <input
//                     type="file"
//                     style={{ display: "none" }}
//                     ref={fileChooser}
//                     onChange={(e) => setSelectedFile(e.target.files![0])}
//                     accept=".jpg, .png, .jpeg, .gif, .bmp, .tif"
//                   />
//                   <IoMdAttach
//                     id="attachment"
//                     onClick={() => fileChooser.current!.click()}
//                   />
//                 </div>
//                 <IoMdCall id="call" />
//                 <MdDelete
//                   id="delete"
//                   onClick={() => setShowConfirmation(true)}
//                 />
//               </div>
//             </div>
//             <div id="messages-list">
//               {currentConv.id === "" ? null : <Messages />}
//             </div>
//           </div>
//         )} */}
//       </div>
//       {!showConfirmation ? null : (
//         <div id="confirmation">
//           <p>Delete conversation?</p>
//           <div id="buttons">
//             <button
//               id="yes"
//               onClick={() => {
//                 // deleteConversation(currentConv.id);
//               }}
//             >
//               Yes
//             </button>
//             <button
//               id="no"
//               onClick={() => {
//                 setShowConfirmation(false);
//               }}
//             >
//               No
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Main;
