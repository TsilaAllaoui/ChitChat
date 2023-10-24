import {
  addDoc,
  collection,
  doc,
  or,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { setCurrentConv } from "../redux/slices/currentConversationSlice";
import { updateChosenUser } from "../redux/slices/chosenUserSlice";
import { useCollection } from "react-firebase-hooks/firestore";
import { setFilter } from "../redux/slices/filterSlice";
import { Conversation, UserInFirebase } from "./Model/Models";
import { BiMessageSquareAdd } from "react-icons/bi";
import { set } from "../redux/slices/popUpSlice";
import { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import { FaSearch } from "react-icons/fa";
import { getInitiials } from "./Model/Modules";
import "../Styles/Conversations.scss";
import { db } from "../Firebase";
import Popup from "./Popup";

function Conversations() {
  return <></>;
}

//   // *************** States ***************

//   const [conversations, setConversations] = useState<Conversation[]>([]);

//   // *************** Redux ****************

//   // const name = useSelector((state: RootState) => state.user.name);
//   // const id = useSelector((state: RootState) => state.user.id);
//   // const popUpState = useSelector((state: RootState) => state.popUp.popUpShown);
//   // const filter = useSelector((state: RootState) => state.filter.filter);
//   // const chosenUser = useSelector((state: RootState) => state.chosenUser.chosenUser);
//   // const dispatch = useDispatch();
//   // const filterValue = useSelector((state: RootState) => state.filter.filter);

//   // **************** Firebase hooks ***************

//   const convsRef = collection(db, "conversations");
//   let q = query(
//     convsRef,
//     or(where("hostId", "==", id), where("guestId", "==", id))
//     );
//   const [conversationsInFirestore, loading, error] = useCollection(q);

//   // ***************** Hooks ********************

//   // For updating conversations list
//   useEffect(() => {
//     let tmp: any[] = [];
//     conversationsInFirestore?.docs.forEach((doc) => {
//       const data: any = { ...doc.data(), id: doc.data().id };
//       console.log(data)
//       const guestName: string = name !== data.guestName ? data.guestName : data.hostName;
//       if (guestName.toLowerCase().includes(filter.toLowerCase())) tmp.push(data);
//     });
//     setConversations(tmp);
//     if (conversationsInFirestore?.docs.length === 0) {
//       dispatch(setCurrentConv({ id: "", guestName: "", hostId: "" }));
//     }
//   }, [conversationsInFirestore, filter]);

//   // For toggling pop up
//   useEffect(() => {
//     if (!popUpState && chosenUser.id != "" && chosenUser.name != "") {
//       addNewConversation();
//       dispatch(
//         updateChosenUser({
//           name: "",
//           email: "",
//           id: "",
//         })
//       );
//     }
//   }, [popUpState]);

//   // *************** Functions *******************

//   // Show pop up
//   const showPopup = () => {
//     dispatch(set(true));
//   };

//   // Add a new conversation
//   const addNewConversation = () => {
//     const user: UserInFirebase = chosenUser;
//     if (user.id === "" || user.name === "") {
//       return;
//     }
//     let pass = false;
//     conversationsInFirestore?.docs.forEach((doc) => {
//       const data: any = { ...doc.data(), id: doc.data().id };
//       if (data.guestId === user.id || data.hostId === user.id) pass = true;
//     });

//     let newConvId: string = "";
//     if (!pass) {
//       const conv: Conversation = {
//         participants: [id, user.id],
//         hostName: name,
//         hostId: id,
//         guestName: user.name,
//         guestId: user.id,
//         id: "",
//       };
//       const convsRef: any = collection(db, "conversations");
//       addDoc(convsRef, conv).then((docRef) => {
//         updateDoc(doc(db, "conversations", docRef.id), {
//           id: docRef.id,
//         }).then(() => {
//           newConvId = docRef.id;
//           addDoc(collection(db, "conversations", docRef.id, "mess"), {
//             receiverId: user.id,
//             senderId: id,
//             message: "First message",
//             hostId: id,
//             sentTime: serverTimestamp(),
//           }).then(() => {
//             if (conversations.length === 0)
//               dispatch(
//                 setCurrentConv({
//                   id: newConvId,
//                   guestName: user.id,
//                   hostId: id,
//                 })
//               );
//           });
//         });
//       });
//     }
//   };

//   // Loading current selected conversations messagse
//   const loadMessages = (conversation: Conversation) => {
//     const _id =
//       conversation.guestId !== id ? conversation.guestId : conversation.hostId;
//     const _name =
//       conversation.guestName !== name
//         ? conversation.guestName
//         : conversation.hostName;
//     dispatch(
//       updateChosenUser({
//         name: _name,
//         id: _id,
//         email: "",
//       })
//     );
//     dispatch(
//       setCurrentConv({ id: conversation.id, guestName: _name, hostId: id })
//     );
//   };

//   // Handle focus when pop up show
//   const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
//     const filterInput: HTMLInputElement = document.querySelector(
//       "#filter-input"
//     ) as HTMLInputElement;
//     filterInput.style.color = "white";
//     if (filterInput.value === "") {
//       filterInput.style.opacity = "0";
//       dispatch(setFilter(e.target.value));
//     }
//   };

//   // Handle filter changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const filterInput: HTMLInputElement = document.querySelector(
//       "#filter-input"
//     ) as HTMLInputElement;
//     if (filterInput.style.opacity === "1") dispatch(setFilter(e.target.value));
//     else filterInput.value = "";
//   };

//   // Toggle the input filter
//   const toggleFilterInput = () => {
//     const filterInput: HTMLInputElement = document.querySelector(
//       "#filter-input"
//     ) as HTMLInputElement;
//     filterInput.style.opacity = filterInput.style.opacity === "0" ? "1" : "0";
//   };

//   // *************** Rendering *****************

//   return (
//     <div>
//       <div id="headers">
//         <p>Chats</p>
//         <input
//           type="text"
//           id="filter-input"
//           onChange={(e) => handleChange(e)}
//           onBlur={(e) => handleFocus(e)}
//         />
//         <FaSearch id="search" onClick={toggleFilterInput}/>
//       </div>
//       <div>
//         {error && <p>{JSON.stringify(error)}</p>}
//         {loading && <p>Loading...</p>}
//         {conversationsInFirestore && (
//           <ul id="conversations-list">
//             {conversations.map((conversation: Conversation) => {
//               // Guest name
//               const guestName =
//                 conversation.guestId !== id
//                   ? conversation.guestName
//                   : conversation.hostName;

//               return (
//                 <li
//                   key={conversation.id + Math.random() + Date.now()}
//                   onClick={() => loadMessages(conversation)}
//                   className="conversation"
//                 >
//                   <div id="profile">
//                     <div id="image">
//                       <p>{getInitiials(guestName)}</p>
//                     </div>
//                     <p>{guestName}</p>
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//       <BiMessageSquareAdd id="add" onClick={showPopup} />
//       {!popUpState ? null : <Popup />}
//     </div>
//   );
// }

// export default Conversations;
