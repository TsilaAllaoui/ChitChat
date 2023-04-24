import { getAuth, onAuthStateChanged, signOut } from "@firebase/auth";
import { SlArrowRight, SlArrowLeft } from "react-icons/sl";
import Conversations from "./Conversations";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Receiver, Sender, UserInFirebase } from "./Models";
import Messages from "./Messages";
import "../styles/Main.scss";
import Popup from "./Popup";
import { auth, db } from "../Firebase";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { RootState, store } from "../redux/store";
import { Provider, useSelector, useDispatch } from "react-redux";
import { update, UserState } from "../redux/slices/userSlice";

function Main() {

  // ************  States   ************


  // State for showing or hiding conversations list
  const [show, setShow] = useState(false);
  
  // States for setting receiver and sender
  const [receiver, setReceiver] = useState<Receiver>({ name: "", id: "" });
  const [sender, setSender] = useState<Sender>({ name: "", id: "" });
  
  const currentConvId = useSelector((state: RootState) => state.currentConvId.id);
  const name = useSelector((state: RootState) => state.user.name);
  const id = useSelector((state: RootState) => state.user.id);
  const dispatch = useDispatch();
  

  // ************  Effects   ************


  // For getting user infos on authentification
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(update({
          name: user.displayName!,
          id: user.uid
        }));
      }
    });
  }, []);



  // ************  Functions   ************


  // Toggling conversations list state
  const toggleConvs = () => {

    setShow(!show);
    let convs = document.getElementById("row")!;
    if (show) {
      convs.style.marginLeft = "0";
    } else {
      convs.style.marginLeft = "-29.5%";
    }
  };

  // To log out
  const navigate = useNavigate();
  const logOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      alert("You logged out...");
      navigate("/login");
    })
      .catch(() => {
        alert("Can't log out. Contact admin...");
      });
  };




  // ************  Rendering   ************

  return (
   <div>
    <h1>Main</h1>
    <div id="main">
      <Conversations/>
      <div id="separator"></div>
      {
        currentConvId === "" ? null :
        <Messages/>
      }
    </div>
   </div>
  );
}

export default Main;
