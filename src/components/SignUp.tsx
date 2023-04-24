import { getAuth, createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import "../styles/SignUp.scss";
import { addDoc, collection, getFirestore } from '@firebase/firestore';

function SignUp(){

    // States for user credentials and infos
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    
    // Error state
    const [error, setError] = useState("");

    // To know if we want to redirect to login page
    const [redirect, setRedirect] = useState(false)

    // For dynamic navigation
    const navigate = useNavigate();
    useEffect(() => {
        if (redirect)
            navigate("/login");
    }, [redirect])
    
    // Sign up new user
    const auth = getAuth();

    // Adding user to user list collection in firebase
    const addNewUser = (name: string, email: string, uid: string) => {
        const db = getFirestore();
        const usersRef = collection(db, "users");
        addDoc(usersRef, {
            name: name,
            email: email,
            uid: uid
        });
    };

    // For signup on submit
    const signUp = (e: any) => {
        e.preventDefault();

        // Safeguard
        if (email === "" || password === "")
            return;

        // Create user into firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCreds) => {
            addNewUser(name, email, userCreds.user.uid);
            updateProfile(userCreds.user, {
                displayName: name
            }).then(() => {
                alert("Account successfully created. Redirecting to login page...");
                setRedirect(true);
            });
        })

        // Catching possible error
        .catch((err) => {
            setError(err.code + " " + err.message);
        });
    };

    return (
        <div>
            <div className="error">{error}</div>
            <form onSubmit={(e) => signUp(e) } method="post" className='from-signup'>
                <label>Username</label>
                <input type="text" name="name" required placeholder="Enter username..." onChange={(e) => setName(e.target.value)}/>
                <label>Email</label>
                <input type="email" name="email" required placeholder="Enter email adress..." onChange={(e) => setEmail(e.target.value)}/>
                <label>Password</label>
                <input type="password" name="password" required placeholder="********" onChange={(e) => setPassword(e.target.value)}/>
                <button type='submit'>Signup</button>
            </form>
        </div>
    )
}

export default SignUp;