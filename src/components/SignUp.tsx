import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "@firebase/auth";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "../styles/SignUp.scss";
import { addDoc, collection, getFirestore } from "@firebase/firestore";
import Splash1 from "../assets/splash1.svg";
import Splash2 from "../assets/splash2.svg";
import { BiUser } from "react-icons/bi";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { Value } from "sass";

function SignUp() {
  // States for user credentials and infos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Error state
  const [error, setError] = useState("");

  // To know if we want to redirect to login page
  const [redirect, setRedirect] = useState(false);

  const [style, setStyle] = useState({ width: "" });

  // For dynamic navigation
  const navigate = useNavigate();
  useEffect(() => {
    if (redirect) navigate("/login");
  }, [redirect]);

  // Sign up new user
  const auth = getAuth();

  // Adding user to user list collection in firebase
  const addNewUser = (name: string, email: string, uid: string) => {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    addDoc(usersRef, {
      name: name,
      email: email,
      uid: uid,
    });
  };

  // For signup on submit
  const signUp = (e: any) => {
    e.preventDefault();

    // Safeguard
    if (email === "" || password === "") return;

    // Create user into firebase
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCreds) => {
        addNewUser(name, email, userCreds.user.uid);
        updateProfile(userCreds.user, {
          displayName: name,
        }).then(() => {
          alert("Account successfully created. Redirecting to login page...");
          setRedirect(true);
        });
      })

      // Catching possible error
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    setStyle({ width: "100px" });
  }, []);

  return (
    <div id="signup">
      <form onSubmit={(e) => signUp(e)} method="post" id="form-signup">
        <h1>Signup</h1>
        <div className="hseparator" style={style}></div>
        <div id="inputs">
          <div className="input-line">
            <p>Username</p>
            <div className="in">
              <BiUser className="icon" />
              <input type="text" onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="input-line">
          <p style={{width: "50px"}}>Email</p>
          <div className="in">
            <MdOutlineAlternateEmail className="icon"/>
            <input type="email" onChange={(e) => setEmail(e.target.value)} value={""}/>
          </div>
          </div>
          <div className="input-line">
            <p>Password</p>
            <div className="in">
                <FaLock className="icon"/>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={""}
                />
            </div>
          </div>
          <button type="submit">Sign up</button>
        </div>
        {error === "" ? null : <div className="error">{error}</div>}
        <p>Already have an account? <a onClick={() => navigate("/login")}>Login</a></p>
      </form>
      <div id="splashes">
        <div id="welcome-container">
            <p id="welcome">Hello! Welcome to ChitChat.</p>
            <div id="welcome-line"></div>
        </div>
        <div id="info">
          <p id="friends">
            Chat with <span style={{ color: "orange" }}>friends</span>
          </p>
          <p id="people">
            Chat with <span style={{ color: "green" }}>people</span>
          </p>
          <p id="family">
            Chat with <span style={{ color: "grey" }}>family</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
