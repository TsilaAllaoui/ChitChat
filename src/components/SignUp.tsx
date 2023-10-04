import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
  signInWithPopup,
  GoogleAuthProvider,
} from "@firebase/auth";
import { addDoc, collection, getDocs, getFirestore } from "@firebase/firestore";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BiUser } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import { auth, db, gauthProvider } from "../Firebase";
import "../styles/SignUp.scss";
import { FcGoogle } from "react-icons/fc";

function SignUp() {
  // ***************** States *******************

  // States for user credentials and infos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // To know if we want to redirect to login page
  const [redirect, setRedirect] = useState(false);

  // Pour le style du separateur
  const [style, setStyle] = useState({ width: "" });

  // ************* Effects ***************

  // For dynamic navigation
  const navigate = useNavigate();
  useEffect(() => {
    if (redirect) navigate("/login");
  }, [redirect]);

  useEffect(() => {
    setStyle({ width: "100px" });
  }, []);

  // ************ Functions ***************

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

  // To sign up with google
  const signUpWithGoogle = () => {
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, gauthProvider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential!.accessToken;
          const user = result.user;

          // Check if user is already subscribed
          let found = false;
          getDocs(collection(db, "users")).then((snap) => {
            snap.forEach((doc) => {
              const data: any = { ...doc.data(), id: doc.id };
              if (data.email === user.email && data.uid === user.uid) {
                found = true;
                return;
              }
            });
            if (found) {
              setShowPopup(true);
            } else {
              addNewUser(
                result.user.displayName!,
                result.user.email!,
                result.user.uid
              );
              navigate("/main");
            }
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          if (error.code === "auth/account-exists-with-different-credential")
            setShowPopup(true);
          console.log(
            "Erreur d'authentification",
            errorCode,
            " ",
            errorMessage
          );
        });
    });
  };

  // ****************** Rendering ******************

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
            <p style={{ width: "50px" }}>Email</p>
            <div className="in">
              <MdOutlineAlternateEmail className="icon" />
              <input type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="input-line">
            <p>Password</p>
            <div className="in">
              <FaLock className="icon" />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Sign up</button>
        </div>
        {error === "" ? null : <div className="error">{error}</div>}
        <p>Or sign up with:</p>
        <FcGoogle id="google" onClick={signUpWithGoogle} />
        <p>
          Already have an account?{" "}
          <a onClick={() => navigate("/login")}>Login</a>
        </p>
      </form>
      <div id="splashes">
        <div id="welcome-container">
          <p id="welcome">
            Hello!<br></br> Welcome to ChitChat.
          </p>
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
      {!showPopup ? null : (
        <div id="popup">
          <p>
            Account already exist. Please login to continue or signup with
            another credentials.
          </p>
          <p>Go to login page?</p>
          <div id="buttons">
            <button
              id="yes"
              onClick={() => {
                navigate("/login");
                setShowPopup(false);
              }}
            >
              Yes
            </button>
            <button id="no" onClick={() => setShowPopup(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
