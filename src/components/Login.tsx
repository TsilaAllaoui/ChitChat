import logo from "../assets/logo.svg";
import "../styles/Login.scss";
import { AiOutlineGoogle, AiOutlineMail, AiOutlineFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {

  // States for the inputs
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <div className="loginApp">
      <div id="logo">
        <img src={logo} alt="" />
      </div>
      <p>
        First time here? then {" "}
        <a id="sign-in" href="#">
          Sign in!
        </a>
      </p>
      <div id="email">
        <span>Email</span>
        <input type="email" id="email-input" onChange={(e) => setEmailValue(e.target.value)} defaultValue="Tsila" />
        <div>{emailValue}</div>
      </div>
      <div id="password">
        <span>Password</span>
        <input id="password-input" type="password" onChange={(e) => setPasswordValue(e.target.value)} defaultValue="cKRWwlRPOfPaWdtv58SB" />
        <div>{passwordValue}</div>
      </div>
      <div id="agreements">
        <input type="checkbox" />
        <p>Accept all agreements</p>
      </div>
      <div id="buttons">
        <button id="forgot-password-button">Forgot password</button>
        <button id="login-button" >
          <Link to="/messages" state={{ receiver: { name: emailValue, id: passwordValue }, sender: { name: "Ariane", id: "NeLZhBOa04SkiEVcAEPf" } }}>LOGIN</Link>
        </button>
      </div>
      <p>Or login with: </p>
      <div id="social-login">
        <FcGoogle id="google" />
        <AiOutlineMail id="mail" />
        <AiOutlineFacebook id="fb" />
      </div>
    </div>
  );
}

export default Login;
