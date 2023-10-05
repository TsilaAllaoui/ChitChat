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
import { MdErrorOutline, MdOutlineAlternateEmail } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { BiUser } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import { auth, db, gauthProvider } from "../Firebase";
import "../styles/SignUpForm.scss";
import { FcGoogle } from "react-icons/fc";
import { createPortal } from "react-dom";

function SignUpForm({ setIsLogin }: { setIsLogin: () => void }) {
  // ***************** States *******************

  // States for user credentials and infos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);

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

  useEffect(() => {
    if (error != "") {
      errorRef.current!.style.opacity = "1";
    }
    setTimeout(() => {
      errorRef.current!.style.opacity = "0";
    }, 1000);
  }, [error]);

  // ************ Refs ***************

  const errorRef = useRef<HTMLDivElement>(null);

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
        let e: string = err.message
          .replace("Firebase: Error (", "")
          .replace(")", "")
          .replace("-", " ");
        setError(e[0].toUpperCase() + e.slice(1));
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
              setShowError(true);
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
          setError(errorMessage);
          if (error.code === "auth/account-exists-with-different-credential")
            setShowError(true);
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
        <div className="error" ref={errorRef}>
          <MdErrorOutline id="icon" />
          <p>{error}</p>
        </div>
        <p>Or sign up with:</p>
        <FcGoogle id="google" onClick={signUpWithGoogle} />
        <p>
          Already have an account? <a onClick={() => setIsLogin()}>Login</a>
        </p>
      </form>
    </div>
  );
}

export default SignUpForm;
