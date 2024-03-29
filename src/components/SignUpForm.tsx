import {
  GoogleAuthProvider,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithPopup,
  updateProfile,
} from "@firebase/auth";
import { addDoc, collection, getDocs, getFirestore } from "@firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { BiUser } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdErrorOutline, MdOutlineAlternateEmail } from "react-icons/md";
import { useNavigate } from "react-router";
import { ScaleLoader } from "react-spinners";
import { IsLoginContext } from "../Contexts/IsLoginContext";
import { auth, db, gauthProvider } from "../Firebase";
import "../styles/SignUpForm.scss";
import Terms from "./Model/Terms";
import Popup from "./Popup";

function SignUpForm() {
  // ***************** States *******************

  // States for user credentials and infos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // To know if we want to redirect to login page
  const [redirect, setRedirect] = useState(false);

  // Pour le style du separateur
  const [style, setStyle] = useState({ width: "" });

  const [showAgreements, setShowAgreements] = useState(false);
  const [agreementsChecked, setAgreementsChecked] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const setIsLogin = useContext(IsLoginContext).setIsLogin;

  // ************* Effects ***************

  // For dynamic navigation
  const navigate = useNavigate();
  useEffect(() => {
    if (redirect) navigate("/login");
  }, [redirect]);

  useEffect(() => {
    setStyle({ width: "100px" });
    const loginApp = document.querySelector("#signup") as HTMLElement;
    loginApp.style.animation = "fade-in 500ms ease-in-out forwards";
  }, []);

  useEffect(() => {
    if (error != "") {
      errorRef.current!.style.opacity = "1";
    }

    setTimeout(() => {
      errorRef.current!.style.opacity = "0";
      setTimeout(() => {
        setError("");
      }, 500);
    }, 2000);
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
    if (email === "" || password === "") {
      setError("Please fill all required fields");
      return;
    }
    if (!agreementsChecked) {
      setAgreementsError();
      return;
    }

    // Create user into firebase
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCreds) => {
        addNewUser(name, email, userCreds.user.uid);
        updateProfile(userCreds.user, {
          displayName: name,
        }).then(() => {
          setRedirectToLogin(true);
          setTimeout(() => {
            setIsLogin(true);
          }, 2000);
        });
      })

      // Catching possible error
      .catch((err) => {
        let msg: string = err.message;
        msg = msg
          .replace("Firebase: ", "")
          .replace("Error (", "")
          .replace(")", "")
          .replace("auth/weak", "")
          .replace("(", "")
          .replace("-", " ");
        setError(msg[0].toUpperCase() + msg.slice(1));
        setLoading(false);
      });
  };

  // To sign up with google
  const signUpWithGoogle = () => {
    setLoading(true);
    setPersistence(auth, browserSessionPersistence).then(() => {
      signInWithPopup(auth, gauthProvider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
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
              setLoading(false);
            } else {
              addNewUser(
                result.user.displayName!,
                result.user.email!,
                result.user.uid
              );
              setRedirectToLogin(true);
              setTimeout(() => {
                setIsLogin(true);
              }, 2000);
            }
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setError(errorMessage);
          if (error.code === "auth/account-exists-with-different-credential")
            setShowError(true);
          let e: string = error.message
            .replace("Firebase: Error (", "")
            .replace(")", "")
            .replace("-", " ");
          setError(e[0].toUpperCase() + e.slice(1));
        });
    });
  };

  const clickAgreements = (e: React.MouseEvent<HTMLElement>) => {
    const checkBox = document.querySelector(
      "#agreements > input"
    ) as HTMLInputElement;
    checkBox.checked = agreementsChecked ? false : true;
    setAgreementsChecked(checkBox.checked);
  };

  const setAgreementsError = () => {
    const agreements = document.querySelector(
      "#agreements > p"
    ) as HTMLPreElement;
    agreements.style.color = "red";
    agreements.style.animation = "shake 500ms ease-in-out";
    setTimeout(() => {
      agreements.style.color = "black";
      agreements.style.animation = "";
    }, 500);
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
            <p style={{ width: "50px" }}>Email *</p>
            <div className="in">
              <MdOutlineAlternateEmail className="icon" />
              <input type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="input-line">
            <p>Password *</p>
            <div className="in">
              <FaLock className="icon" />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div id="agreements">
            <input
              type="checkbox"
              checked={agreementsChecked}
              onChange={(e) => setAgreementsChecked(e.currentTarget.checked)}
            />
            <p onClick={clickAgreements}>Accept all agreements</p>
          </div>
          <button type="submit">
            {loading ? (
              <ScaleLoader
                color="#FFFFFF"
                loading={loading}
                height={10}
                width={2}
                radius={15}
                margin={1}
              ></ScaleLoader>
            ) : (
              <span>SignUp</span>
            )}
          </button>
        </div>
        <div className="error" ref={errorRef}>
          <MdErrorOutline id="icon" />
          <p>{error}</p>
        </div>
        <p>Or sign up with:</p>
        <FcGoogle id="google" onClick={signUpWithGoogle} />
        <p>
          Already have an account? <a onClick={() => setIsLogin(true)}>Login</a>
        </p>
        <p id="show-agreements" onClick={() => setShowAgreements(true)}>
          Show terms and agreements
        </p>
        <Terms
          showAgreements={showAgreements}
          hideAgreements={() => setShowAgreements(false)}
        />
      </form>
      {redirectToLogin ? (
        <Popup
          content="Account created successfully... Check Email for verification..."
          hidePopup={() => setRedirectToLogin(false)}
        />
      ) : null}
    </div>
  );
}

export default SignUpForm;
